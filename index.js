class LikeButton {
  state = false;
  node = null

  // 此处补充代码
  constructor(state) {
    this.state = state || false
  }
  changeState() {
    this.state = !this.state
    this.render()
  }
  create() {
    console.log(1);
    this.node = document.createElement('span')
    this.node.onclick = () => this.changeState()
  }
  render() {
    this.node || this.create()
    this.node.innerHTML = `${this.state === false ? '点赞' : '取消'}`
    return this.node
  }
  
}
const wrapper = document.querySelector(".wrapper");
const likeButton = new LikeButton();
wrapper.appendChild(likeButton.render());
