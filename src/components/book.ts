import * as THREE from 'three';

interface Page {
  mesh: THREE.Mesh;
  index: number;
}
export default class Book {
  private group: THREE.Group;
  private frontCover: THREE.Object3D;
  private backCover: THREE.Object3D;
  private pageCount: number;
  private pages: Page[];
  private currentPage: number;

  constructor(pageCount = 20) {
    const group = new THREE.Group();
    this.group = group;
    this.pageCount = pageCount;
    this.currentPage = 10;

    const coverGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.03);
    coverGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(1.1, 0, 0));
    const coverMaterial = new THREE.MeshStandardMaterial({ color: 0x50301a });

    const frontCover = new THREE.Mesh(coverGeometry, coverMaterial);
    frontCover.position.z = -0.02;
    group.add(frontCover);
    this.frontCover = frontCover;

    const backCover = new THREE.Mesh(coverGeometry, coverMaterial);
    backCover.position.z = -0.02;
    group.add(backCover);
    this.backCover = backCover;

    const pageGeometry = new THREE.PlaneGeometry(2.1, 2.97);
    pageGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(1.05, 0, 0));
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    // Pages are more than one thing - this refers to sheets of paper, while
    // pageCount refers to the number of sides that we can write on
    const actualPageCount = Math.ceil(pageCount / 2) + 2;

    const pages: Page[] = [];
    for (let i = 0; i < actualPageCount; i++) {
      const page = new THREE.Mesh(pageGeometry, pageMaterial);
      group.add(page);
      pages.push({ mesh: page, index: i });
    }
    this.pages = pages;

    this.setPageAngles();
  }

  public getGroup() {
    return this.group;
  }

  public update(t: number) {
    // this.group.rotation.y = t;
  }

  private setPageAngles() {
    const frontRotation = this.getPageAngle(0);
    this.frontCover.rotation.y = frontRotation;
    this.frontCover.position.z =
      frontRotation > (Math.PI / 8) * 12 ? 0.02 : -0.02;
    this.backCover.rotation.y = this.getPageAngle(this.pages.length - 1);

    this.pages.forEach((page, i) => {
      page.mesh.rotation.y = this.getPageAngle(i);
    });
  }

  private getPageAngle(index: number) {
    const min = (Math.PI / 8) * 9;
    const max = (Math.PI / 8) * 15;

    const eachPageAngle = Math.PI / 128;

    const actualPage = this.currentPage / 2;
    if (index < actualPage) {
      return min + eachPageAngle * index;
    }

    const reverseIndex = this.pages.length - 1 - index;
    return max - eachPageAngle * reverseIndex;
  }
}
