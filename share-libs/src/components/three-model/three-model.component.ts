import { Component, OnInit, Input } from '@angular/core';
import { IndexDBService } from './index-db.service';
declare var THREE: any;
/**3D模型加载组件 */
@Component({
  selector: 'app-three-model',
  templateUrl: './three-model.component.html',
  styleUrls: ['./three-model.component.less']
})
export class ThreeModelComponent implements OnInit {
  /**模型名称 */
  @Input() inModelName: string = "box";
  /**动画效果唯一标识 */
  animateId: number;
  obj: any;//模型对象
  mouseFlag: boolean = true;//鼠标操作标识
  scene: any;//场景
  orbitControls: any;//场景控制器
  clock: any;
  renderer: any;//渲染器
  camera: any;//相机
  container: any;//输出视图
  spinModel: boolean = true;
  private _modelName: string = '';

  modelChildrenMap: Map<any, any> = new Map();
  modelMap: Map<string, string> = new Map();
  constructor(private model_: IndexDBService) {
  }

  ngOnChanges(): void {
    this.load3DModel();
  }

  ngOnInit() {
    this.container = document.getElementById("WebGL-output");
    this.load3DModel();
  }

  /**加载3d模型 */
  load3DModel() {
    this.initContainer();
    /**从模型服务中获取模型 */
    this.model_.get3DModel(this._modelName).then(res => {
      this.parseModel(res.modelData)
    })
  }

  /**初始化模型容器 */
  initContainer() {
    if (this._modelName == this.inModelName) {
      return;
    }
    /**清楚动画 */
    if (this.animateId) {
      cancelAnimationFrame(this.animateId);
    }
    this._modelName = this.inModelName;
    this.spinModel = true;
    if (this.container && this.container.lastChild.tagName.toLocaleLowerCase() === "canvas") {
      this.container.removeChild(this.container.lastChild);
    }
  }

  /**解析模型 */
  parseModel(data) {
    let that = this;
    let config = {
      x: 11,
      z: 0.5,
      scale: [0.02, 0.02, 0.02]
    };
    new THREE.ObjectLoader().parse(data, function (e) {
      if (!that.container) {
        return
      }
      console.log(e.children[0], "e.children[0]");
      that.initScene();
      that.scene.add(e.children[0])
      let obj = that.scene.children[2];
      that.obj = obj;
      if (obj.children && obj.children.length > 0) {
        let model = obj.children;
        model.forEach(e => {
          that.modelChildrenMap.set(e.name, e)
        });
      }
      // obj.rotation.x = config.x;
      // obj.rotation.z = config.z;
      obj.scale.set(...config.scale)
    }, '.');
    that.spinModel = false;
    console.log(this.modelChildrenMap, 'obj')
  }

  /***/
  initScene() {
    this.scene = new THREE.Scene();
    // this.container.addEventListener('click', (e)=>{this.onDocumentMouseMove(e)}, false);
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 1, 2000);
    this.camera.position.set(0, 0, 13)
    this.orbitControls = new THREE.OrbitControls(this.camera, this.container);
    this.orbitControls.enablePan = false;//防止右键拖动
    this.orbitControls.autoRotate = false;
    // this.orbitControls.autoRotateSpeed = 5;
    this.clock = new THREE.Clock();
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);
    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    this.scene.add(pointLight);
    this.camera.add(pointLight);
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color("rgb(236, 236, 236)"));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    this.animate()
  }

  animate() {
    let that = this;
    that.render();
    this.animateId = requestAnimationFrame(() => { that.animate() });
  }

  render() {
    this.orbitControls.update(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);
  }

  onDocumentMouseMove(event) {
    event.preventDefault();
    let that = this;
    var vector = new THREE.Vector3(((event.clientX - that.container.getBoundingClientRect().x) / that.container.clientWidth) * 2 - 1, -((event.clientY - that.container.getBoundingClientRect().y) / that.container.clientHeight) * 2 + 1, 0.5);
    vector = vector.unproject(that.camera);
    var raycaster = new THREE.Raycaster(that.camera.position, vector.sub(that.camera.position).normalize());
    var intersects = raycaster.intersectObjects(that.obj.children, true);
    console.log(intersects.length);
    if (intersects.length > 0) {
      that.mouseFlag = false
      let material = intersects[0].object.material;
      that.prevModelSet(material);
      material.color.set(0xffff00);
      material.transparent = true;
      material.opacity = 0.1;
    } else {
      that.mouseFlag = true
    }
  }


  prevMater: any;
  prevMaterOption: any = {};
  /**@param 还原上次点击的部件材质 */
  prevModelSet(material) {
    if (this.prevMater && this.prevMaterOption) {
      this.prevMater.color.set(JSON.parse(this.prevMaterOption.color));
      this.prevMater.transparent = this.prevMaterOption.transparent;
      this.prevMater.opacity = this.prevMaterOption.opacity;
    }
    this.prevMater = material;
    this.prevMaterOption.color = JSON.stringify(material.color);
    this.prevMaterOption.transparent = material.transparent;
    this.prevMaterOption.opacity = material.opacity;
  }

}
