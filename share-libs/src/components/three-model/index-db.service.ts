import { Injectable } from '@angular/core';

/**数据库服务 */
@Injectable({
  providedIn: 'root'
})
export class IndexDBService {
  /**数据库名*/
  dbname: string = "harbor";
  /**表名*/
  tabname: string = 'model';
  /**数据库*/
  db: IDBDatabase;
  /**异步结果返回方法 */
  resolve: (data: any) => void;
  modeName: string;
  modelData: any;
  constructor() { }

  /**获取2D模型 */
  get3DModel(name: string): Promise<Model3DData> {
    this.modeName = name;
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.openDb();
    })
  }

  /**打开数据库，没有会新建 */
  private openDb() {
    var indexedDB: IDBFactory = window.indexedDB || window["webkitIndexedDB"] || window["mozIndexedDB"] || window["msIndexedDB"];
    var request: IDBOpenDBRequest = indexedDB.open(this.dbname, 1);
    request.onsuccess = e => {
      this.db = request.result;
      this.getModelByDB()
    };
    request.onerror = (e) => {
      this.getModelByWorker()
    };
    /**数据库升级,成功后调用success */
    request.onupgradeneeded = (e) => {
      this.db = request.result;
      /**判断表是否存在，不存在就新建 */
      if (!this.db.objectStoreNames.contains(this.tabname)) {
        this.db.createObjectStore(this.tabname, { keyPath: 'name' });
      }
    }
  }

  /**从数据库获取模型 */
  private getModelByDB() {
    var store = this.db.transaction([this.tabname]).objectStore(this.tabname)
    var req = store.get(this.modeName)
    req.onsuccess = (event) => {
      if (req.result == null) {
        this.getModelByWorker()
      } else {
        this.modelData = req.result;
        console.log('使用数据库数据');
        this.resolve(this.modelData)
      }
    }
    req.onerror = (event) => {
      this.getModelByWorker();
    }
  }

  /**通过线程获取模型 */
  private getModelByWorker() {
    var worker = new Worker('../../../assets/3d/js/export.js');
    worker.postMessage(this.modeName);
    worker.onmessage = (event) => {
      this.modelData = JSON.parse(event.data);
      worker.terminate();
      this.tableAdd(this.modelData);
    }
    worker.onerror = function (e) {
      console.log([
        'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
      ].join(''));
    };
  }

  /**将数据添加到表中 */
  private tableAdd(modelData) {
    let data = { name: this.modeName, modelData };
    this.resolve(data)
    this.db.transaction([this.tabname], 'readwrite').objectStore(this.tabname).add(data);
  }

}

interface Model3DData {
  name: string,
  modelData: any
}