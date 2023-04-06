// 模拟移动端点击事件

export class MobileClickManager {
  startX;
  startY;
  dom;
  isPressDown = false;
  clickHandler = () => {};
  constructor(dom) {
    this.dom = dom;
  }
  addClick(clickHandler) {
    this.clickHandler = clickHandler;
    this.dom.addEventListener('touchstart', this.onTouchStart);
    this.dom.addEventListener('touchend', this.onTouchEnd);
  }
  removeClick() {
    this.dom.removeEventListener('touchstart', this.onTouchStart);
    this.dom.removeEventListener('touchend', this.onTouchEnd);
  }
  onTouchEnd = (e) => {
    if (!this.isPressDown) return;
    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;

    const distanceX = this.startX - x;
    const distanceY = this.startY - y;

    if (Math.floor(distanceX) == 0 && Math.floor(distanceY) == 0) {
      this.clickHandler(e);
    }
    this.isPressDown = false;
  };
  onTouchStart = (e) => {
    if (e.touches.length == 1) {
      this.isPressDown = true;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    }
  };
}
