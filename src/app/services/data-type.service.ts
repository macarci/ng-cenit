import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';

@Injectable()
export class DataTypeService {

  dataTypes: { [key: string]: DataType } = {};
  promises: { [key: string]: Promise<DataType> } = {};

  constructor(readonly apiService: ApiService) {
  }

  async getById(id: string): Promise<DataType> {
    let promise = this.promises[id];
    if (!promise) {
      this.promises[id] = promise = new Promise<DataType>(
        (resolve, reject) => {
          let dataType = this.dataTypes[id];
          if (!dataType) {
            this.apiService.get(['setup', 'data_type', id], {template: {viewport: '{_id namespace name title _type schema}'}})
              .subscribe(
                (response) => {
                  this.dataTypes[id] = dataType = new DataType(
                    response['_id'],
                    response['_type'],
                    response['namespace'],
                    response['name'],
                    response['title'],
                    response['_type'] === JSON_TYPE ? null : response['schema']
                  );
                  dataType.dataTypeService = this;
                  dataType.apiService = this.apiService;
                  resolve(dataType);
                  delete this.promises[id];
                },
                error => reject(error)
              );
          } else {
            resolve(dataType);
          }
        });
    }
    return await promise;
  }

  find(criteria: Object): Promise<DataType> {
    return new Promise<DataType>(
      (resolve, reject) => {
        this.apiService.get(['setup', 'data_type'], {query: criteria, template: {viewport: '{_id}'}})
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
    readonly propertySchema?: Object,
    readonly required?: boolean
  ) {
  }

  getSchema(): Promise<Object> {
    if (this.propertySchema) {
      return Promise.resolve(this.propertySchema);
    }
    return this.dataType.getSchema();
  }

  getSchemaEntry<T>(key: string): Promise<T> {
    return new Promise<T>(
      (resolve, reject) => {
        this.getSchema()
          .then(
            schema => {
              resolve(schema[key]);
            }
          )
          .catch(e => reject(e));
      }
    );
  }

  isVisible(): Promise<boolean> {
    return new Promise<boolean>(
      (resolve, reject) => {
        this.getSchema()
          .then(
            schema => resolve(
              (!schema.hasOwnProperty('visible') || schema['visible']) &&
              (!schema.hasOwnProperty('edi') || (schema['edi'].constructor === Object && !schema['edi']['discard']))
            )
          )
          .catch(error => reject(error));
      }
    );
  }

  isSimple(): Promise<boolean> {
    return new Promise<boolean>(
      (resolve, reject) => {
        this.getSchema()
          .then(
            schema => resolve(['integer', 'number', 'string', 'boolean'].indexOf(schema['type']) !== -1)
          )
          .catch(error => reject(error));
      }
    );
  }

  isReferenced(): Promise<boolean> {
    return new Promise<boolean>(
      (resolve, reject) => {
        this.getSchema()
          .then(
            schema => resolve(schema['referenced'])
          )
          .catch(error => reject(error));
      }
    );
  }

  isMany(): Promise<boolean> {
    return new Promise<boolean>(
      (resolve, reject) => {
        this.getSchema()
          .then(
            schema => resolve(schema['type'] === 'array')
          )
          .catch(error => reject(error));
      }
    );
  }

  getTitle(): Promise<string> {
    return new Promise<string>(
      (resolve, reject) => {
        this.getSchema()
          .then(
            schema => {
              let title;
              if (title = schema['title']) {
                resolve(title.toString());
              } else {
                resolve(this.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
              }
            }
          )
          .catch(e => reject(e));
      }
    );
  }
}

export const JSON_TYPE = 'Setup::JsonDataType';
export const FILE_TYPE = 'Setup::FileDataType';
export const CENIT_TYPE = 'Setup::CenitDataType';

export class DataType {

  properties: Property[];
  propsPromise: Promise<Property[]>;

  schemaPromise: Promise<Object>;

  constructor(
    readonly id: string,
    readonly type: string,
    readonly namespace: string,
    readonly name: string,
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
            this.apiService.get(['setup', 'data_type', this.id, 'digest', 'schema']).subscribe(
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

  visibleProps(): Promise<Property[]> {
    return new Promise<Property[]>(
      (resolve, reject) => {
        this.getProps()
          .then(
            (props: Property[]) => {
              Promise.all(props.map(prop => prop.isVisible()))
                .then(
                  (visibles: boolean[]) => {
                    resolve(
                      visibles.map((v: boolean, index: number) => v ? props[index] : null)
                        .filter(p => p)
                    );
                  }
                )
                .catch(error => reject(error));
            }
          )
          .catch(error => reject(error));
      }
    );
  }

  async mergeSchema(schema: Object): Promise<Object> {
    return new Promise<Object>(
      (resolve, reject) => {
        if (schema['extends'] || schema['$ref']) {
          this.apiService.post(['setup', 'data_type', this.id, 'digest', 'schema'], schema).subscribe(
            mergedSchema => resolve(mergedSchema),
            error => reject(error)
          );
        } else {
          resolve(schema);
        }
      }
    );
  }

  getTitle(): Promise<string> {
    return new Promise<string>(
      (resolve, reject) => {
        this.getSchema()
          .then(
            schema => {
              let title;
              if (title = schema['title']) {
                resolve(title.toString());
              } else {
                resolve(this.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
              }
            }
          )
          .catch(e => reject(e));
      }
    );
  }

  getSchemaEntry<T>(key: string): Promise<T> {
    return new Promise<T>(
      (resolve, reject) => {
        this.getSchema()
          .then(
            schema => {
              resolve(schema[key]);
            }
          )
          .catch(e => reject(e));
      }
    );
  }

  private propertyFrom(name: string, schema: Object): Promise<Property> {
    return new Promise<Property>(
      (propResolve, propReject) => {
        let ref, resolveDataType: Promise<DataType>;
        // Checking referenced schema
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
              Object.keys(items).length === 1 && (ref = items['$ref']) && (ref.constructor === String || ref.constructor === Object))
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
        // Not referenced schema
        if (!resolveDataType) {
          resolveDataType = new Promise<DataType>(
            (resolve, reject) => {
              this.mergeSchema(schema)
                .then(
                  mergedSchema => {
                    let typeSchema: Object;
                    if (mergedSchema['type'] === 'array' && mergedSchema.hasOwnProperty('items')) {
                      typeSchema = mergedSchema['items'];
                    } else {
                      typeSchema = mergedSchema;
                    }
                    resolve(new DataType(
                      null,
                      'Setup::JsonDataType',
                      null,
                      this.name + '::' + name,
                      null,
                      typeSchema,
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
            dataType.mergeSchema(schema)
              .then(
                mergedSchema => propResolve(new Property(name, dataType, mergedSchema))
              )
              .catch(error => propReject(error));
          }
        ).catch(error => propReject(error));
      }
    );
  }

  private strip(schema: Object): Object {
    let nakedSchema = null;
    if (this.schema) {
      nakedSchema = {};
      Object.keys(schema).forEach(key => {
        if (DECORATOR_PROPS.indexOf(key) === -1) {
          nakedSchema[key] = schema[key];
        }
      });
    }
    return nakedSchema;
  }

  createFrom(data: Object): Observable<Object> {
    return this.apiService.post(
      ['setup', 'data_type', this.id, 'digest'], data, {
        template: {
          viewport: '{_id}'
        }
      });
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
  'referenced_by',
  'export_embedded',
  'exclusive'
];
