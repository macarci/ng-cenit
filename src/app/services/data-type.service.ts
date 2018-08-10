import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

@Injectable()
export class DataTypeService {

  constructor(private apiService: ApiService) {
  }

  getById(id: string): Promise<DataType> {
    return new Promise<DataType>(
      (resolve, reject) => {
        this.apiService.get(['setup', 'data_type', id], {}, '{id namespace name title}')
          .subscribe(
            (dataType: DataType) => {
              dataType = new DataType(
                dataType['id'],
                dataType['namespace'],
                dataType['name'],
                dataType['title']
              );
              dataType.dataTypeService = this;
              dataType.apiService = this.apiService;
              resolve(dataType);
            },
            error => reject(error)
          );
      });
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
          if (this.properties) {
            resolve(this.properties);
            this.propsPromise = null;
          } else {
            this.getSchema()
              .then(schema => {
                const propSchemas = schema['properties'] || {};
                Promise.all(
                  Object.keys(propSchemas).map(
                    (property) => new Promise<Property>(
                      (propResolve, propReject) => {
                        this.mergeSchema(propSchemas[property])
                          .then(propSchema => {
                            propResolve(new Property(property, this, propSchema));
                          })
                          .catch(error => propReject(error));
                      }
                    )
                  )
                ).then((properties: Property[]) => {
                  resolve(properties);
                  this.propsPromise = null;
                })
                  .catch(error => reject(error));
              })
              .catch(error => reject(error));
          }
        }
      );
    }
    return await this.propsPromise;
  }

  async mergeSchema(schema: Object): Promise<Object> {
    return new Promise<Object>(
      (resolve, reject) => {
        this.apiService.digest(['setup', 'data_type', this.id], schema).subscribe(
          mergedSchema => resolve(mergedSchema),
          error => reject(error)
        );
      }
    );
  }
}
