import * as THREE from 'three';

export default class Book {
  private group: THREE.Group;

  constructor() {
    const group = new THREE.Group();
    this.group = group;

    const coverGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.03);
    coverGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(1.1, 0, 0));
    const coverMaterial = new THREE.MeshStandardMaterial({ color: 0x50301a });

    const cover1 = new THREE.Mesh(coverGeometry, coverMaterial);
    group.add(cover1);
    cover1.rotation.y = (Math.PI / 8) * 9;
    cover1.position.z = -0.02;

    const cover2 = new THREE.Mesh(coverGeometry, coverMaterial);
    group.add(cover2);
    cover2.rotation.y = (Math.PI / 8) * 15;
    cover2.position.z = -0.02;

    const pageGeometry = new THREE.PlaneGeometry(2.1, 2.97);
    pageGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(1.05, 0, 0));
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 13; i++) {
      const page = new THREE.Mesh(pageGeometry, pageMaterial);
      group.add(page);
      page.rotation.y = (Math.PI / 8) * (9 + i / 2);
    }
  }

  public getGroup() {
    return this.group;
  }

  public update(t: number) {
    // this.group.rotation.y = t;
  }
}
