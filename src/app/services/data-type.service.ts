import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

@Injectable()
export class DataTypeService {

  constructor(private apiService: ApiService) {
  }

  getById(id: string): Promise<DataType> {
    return new Promise<DataType>(
      (resolve, reject) => {
        this.apiService.get(['setup', 'data_type', id], {template: {viewport: '{_id namespace name title}'}})
          .subscribe(
            (response) => {
              const dataType = new DataType(
                response['_id'],
                response['namespace'],
                response['name'],
                response['title']
              );
              dataType.dataTypeService = this;
              dataType.apiService = this.apiService;
              resolve(dataType);
            },
            error => reject(error)
          );
      });
  }

  find(criteria: Object): Promise<DataType> {
    return new Promise<DataType>(
      (resolve, reject) => {
        this.apiService.get(['setup', 'data_type'], {query: criteria, template: {viewport: '_id'}})
          .subscribe(
            response => {
              const item = response['items'][0];
              if (item) {
                this.getById(item['_id'])
                  .then((dataType: DataType) => resolve(dataType))
                  .catch(error => reject(error));
              } else {
                reject('Data type ref ' + JSON.stringify(criteria) + ' not found');
              }
            },
            error => reject(error));
      }
    );
  }
}

export class Property {
  constructor(
    readonly name: string,
    readonly dataType: DataType,
    readonly schema?: Object,
    readonly required?: boolean
  ) {
  }
}

export class DataType {

  properties: Property[];
  propsPromise: Promise<Property[]>;

  schemaPromise: Promise<Object>;

  constructor(
    private id: string,
    private namespace: string,
    private name: string,
    private title: string,
    private schema?: Object,
    public dataTypeService?: DataTypeService,
    public apiService?: ApiService
  ) {
  }

  async getSchema(): Promise<Object> {
    if (!this.schemaPromise) {
      this.schemaPromise = new Promise<Object>(
        (resolve, reject) => {
          if (this.schema) {
            resolve(this.schema);
          } else {
            this.apiService.digest(['setup', 'data_type', this.id]).subscribe(
              schema => {
                this.schema = schema;
                resolve(schema);
                this.schemaPromise = null;
              },
              error => reject(error)
            );
          }
        }
      );
    }
    return await this.schemaPromise;
  }

  async getProps(): Promise<Property[]> {
    if (!this.propsPromise) {
      this.propsPromise = new Promise<Property[]>(
        (resolve, reject) => {
          const handleError = error => reject(error);
          if (this.properties) {
            resolve(this.properties);
            this.propsPromise = null;
          } else {
            this.getSchema()
              .then(schema => {
                this.mergeSchema(schema['properties'] || {}).then(
                  propSchemas => {
                    Promise.all(
                      Object.keys(propSchemas).map(
                        (property) => this.propertyFrom(property, propSchemas[property])
                      )
                    ).then((properties: Property[]) => {
                      resolve(properties);
                      this.propsPromise = null;
                    })
                      .catch(handleError);
                  }
                ).catch(handleError);
              })
              .catch(handleError);
          }
        }
      );
    }
    return await this.propsPromise;
  }

  async mergeSchema(schema: Object): Promise<Object> {
    return new Promise<Object>(
      (resolve, reject) => {
        if (schema['extends'] || schema['$ref']) {
          this.apiService.digest(['setup', 'data_type', this.id], schema).subscribe(
            mergedSchema => resolve(mergedSchema),
            error => reject(error)
          );
        } else {
          resolve(schema);
        }
      }
    );
  }

  private propertyFrom(name: string, schema: Object): Promise<Property> {
    return new Promise<Property>(
      (propResolve, propReject) => {
        // Checking referenced schema
        let ref, resolveDataType: Promise<DataType>;
        if (schema.constructor === Object && (
          ((ref = schema['$ref']) && ref.constructor !== Array) || schema['type'] === 'array')
        ) {
          if (ref && ref.constructor !== Object) {
            ref = ref.toString();
          }
          const nakedSchema = this.strip(schema);
          const size = Object.keys(nakedSchema).length;
          let items: Object;
          if (
            (ref && (size === 1 || (size === 2 && nakedSchema.hasOwnProperty('referenced')))) ||
            (nakedSchema['type'] === 'array' && (items = this.strip(nakedSchema['items'])) &&
              (size === 2 || (size === 3 && nakedSchema.hasOwnProperty('referenced'))) &&
              Object.keys(items).length === 1 && ((ref = items['$ref']) && ref.constructor === String || ref.constructor === Object))
          ) {
            if (ref.constructor === Object) {
              resolveDataType = this.dataTypeService.find(ref);
            } else {
              resolveDataType = new Promise<DataType>(
                (resolve, reject) => {
                  this.dataTypeService.find({namespace: this.namespace, name: ref})
                    .then((dataType: DataType) => resolve(dataType))
                    .catch(
                      error => {
                        this.dataTypeService.find({name: ref})
                          .then((dataType: DataType) => resolve(dataType))
                          .catch(err => reject('Data type ref ' + JSON.stringify(ref) + ' not found'));
                      });
                }
              );
            }
          }
        }
        if (!resolveDataType) {
          resolveDataType = new Promise<DataType>(
            (resolve, reject) => {
              this.mergeSchema(schema)
                .then(
                  mergedSchema => {
                    if (mergedSchema['type'] === 'array' && mergedSchema.hasOwnProperty('items')) {
                      schema = mergedSchema['items'];
                    } else {
                      schema = mergedSchema;
                    }
                    resolve(new DataType(
                      null,
                      null,
                      this.name + '::' + name,
                      null,
                      schema,
                      this.dataTypeService,
                      this.apiService
                    ));
                  }
                )
                .catch(err => reject(err));
            }
          );
        }
        resolveDataType.then(
          (dataType: DataType) => {
            propResolve(new Property(name, dataType, schema));
          }
        ).catch(error => propReject(error));
      }
    );
  }

  private strip(schema: Object): Object {
    let nakedSchema = null;
    if (this.schema) {
      nakedSchema = {};
      for (const key in schema) {
        if (DECORATOR_PROPS.indexOf(key) > -1) {
          nakedSchema[key] = schema[key];
        }
      }
    }
    return nakedSchema;
  }
}

const DECORATOR_PROPS = [
  'types',
  'contextual_params',
  'data',
  'filter',
  'group',
  'xml',
  'unique',
  'title',
  'description',
  'edi',
  'format',
  'example',
  'enum',
  'readOnly',
  'default',
  'visible',
  'referenced_by'
];