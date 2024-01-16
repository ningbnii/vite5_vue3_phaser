import GameItem from './gameItem.js'

class Game extends Phaser.Scene {
  constructor() {
    super()
  }

  create() {
    this.gameItems = []
    // 保存数字二维数组
    this.numbers = []
    // 数字维数，4行4列
    this.dimension = 4
    // 方格宽度
    this.itemWidth = 100
    // 方格间隔
    this.itemPadding = 10
    // 生成随机数字
    this.createCompleteStr()
    // 创建16个方块
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        // 创建一个方块
        const gameItem = new GameItem(this, 0, 0, this.itemWidth, this.numbers[i][j], i, j)

        // 将方块添加到数组中
        this.gameItems.push(gameItem)
        // 0的索引
        if (this.numbers[i][j] === 0) {
          this.zeroIndex = this.gameItems.length - 1
        }
      }
    }

    // 点击数字，交换该数字和0的位置
    this.input.on('gameobjectdown', (pointer, gameObject) => {
      // 获取当前数字的位置
      const { x, y } = gameObject
      // 获取0的位置
      const { x: zeroX, y: zeroY } = this.gameItems[this.zeroIndex]
      // 如果当前数字和0相邻，则交换位置
      if ((x === zeroX && Math.abs(y - zeroY) === this.itemWidth + this.itemPadding) || (y === zeroY && Math.abs(x - zeroX) === this.itemWidth + this.itemPadding)) {
        // 交换数字
        this.swapNumber(gameObject, this.gameItems[this.zeroIndex])
        // 交换数字在二维数组中的位置
        this.swapNumberInArray(gameObject, this.gameItems[this.zeroIndex])
      }
    })

    // 将方块添加到一个容器中
    const container = this.add.container(0, 0, this.gameItems)
    // 设置容器的大小
    container.setSize(this.itemWidth * this.dimension + this.itemPadding * (this.dimension - 1), this.itemWidth * this.dimension + this.itemPadding * (this.dimension - 1))

    // 计算容器容器的宽度和高度
    const containerWidth = container.width
    const containerHeight = container.height
    // 计算容器的中心点
    const containerCenterX = containerWidth / 2
    const containerCenterY = containerHeight / 2

    // 添加主相机
    const mainCamera = this.cameras.main
    // 将主相机的中心点设置为容器的中心点
    // 计算容器的中心点

    mainCamera.centerOn(containerCenterX, containerCenterY)

    // 将方块分成4行4列，每个方块之间间隔10px
    Phaser.Actions.GridAlign(this.gameItems, {
      width: this.dimension,
      height: this.dimension,
      cellWidth: this.itemWidth + this.itemPadding,
      cellHeight: this.itemWidth + this.itemPadding,
      x: 0,
      y: 0,
      position: Phaser.Display.Align.TOP_LEFT,
    })
  }

  // 交换数字
  swapNumber(number1, number2) {
    // 交换数字的位置
    const { x: x1, y: y1 } = number1
    const { x: x2, y: y2 } = number2
    number1.setPosition(x2, y2)
    number2.setPosition(x1, y1)
  }

  // 交换数字在二维数组中的位置
  swapNumberInArray(number1, number2) {
    // 交换数字在二维数组中的位置
    const { i: x1, j: y1 } = number1
    const { i: x2, j: y2 } = number2
    const temp = this.numbers[x1][y1]
    this.numbers[x1][y1] = this.numbers[x2][y2]
    this.numbers[x2][y2] = temp
    // 交换数字的i和j
    number1.i = x2
    number1.j = y2
    number2.i = x1
    number2.j = y1
    // 判断是否完成
    this.isComplete()
  }

  // 创建完成的字符串
  createCompleteStr() {
    this.completeArr = []
    this.completeStr = ''
    for (let i = 1; i < this.dimension * this.dimension; i++) {
      this.completeArr.push(i)
    }
    this.completeArr.push(0)
    this.completeStr = this.completeArr.join(',')
    // 随机打乱数字
    // 将completeArr转成二维数组，每行包含this.dimension个数字
    this.numbers = []
    for (let i = 0; i < this.completeArr.length; i += this.dimension) {
      this.numbers.push(this.completeArr.slice(i, i + this.dimension))
    }

    // 模拟交换0和其他数字的位置，交换100次
    for (let i = 0; i < 10000; i++) {
      // 找到this.numbers中0的位置，0和它相邻的数字交换位置
      // 找到0的位置
      let zeroI = 0
      let zeroJ = 0
      for (let i = 0; i < this.dimension; i++) {
        for (let j = 0; j < this.dimension; j++) {
          if (this.numbers[i][j] === 0) {
            zeroI = i
            zeroJ = j
          }
        }
      }
      // 0和它相邻的数字交换位置
      // 随机生成一个0-3的数字，0表示上，1表示下，2表示左，3表示右
      const direction = Math.floor(Math.random() * 4)
      switch (direction) {
        case 0:
          // 0的上面有数字
          if (zeroI - 1 >= 0) {
            const temp = this.numbers[zeroI][zeroJ]
            this.numbers[zeroI][zeroJ] = this.numbers[zeroI - 1][zeroJ]
            this.numbers[zeroI - 1][zeroJ] = temp
          }
          break
        case 1:
          // 0的下面有数字
          if (zeroI + 1 < this.dimension) {
            const temp = this.numbers[zeroI][zeroJ]
            this.numbers[zeroI][zeroJ] = this.numbers[zeroI + 1][zeroJ]
            this.numbers[zeroI + 1][zeroJ] = temp
          }
          break
        case 2:
          // 0的左边有数字
          if (zeroJ - 1 >= 0) {
            const temp = this.numbers[zeroI][zeroJ]
            this.numbers[zeroI][zeroJ] = this.numbers[zeroI][zeroJ - 1]
            this.numbers[zeroI][zeroJ - 1] = temp
          }
          break
        case 3:
          // 0的右边有数字
          if (zeroJ + 1 < this.dimension) {
            const temp = this.numbers[zeroI][zeroJ]
            this.numbers[zeroI][zeroJ] = this.numbers[zeroI][zeroJ + 1]
            this.numbers[zeroI][zeroJ + 1] = temp
          }
          break
      }
    }
  }

  // 判断是否完成
  isComplete() {
    // 判断是否完成
    let isComplete = true

    // 遍历二维数组this.numbers，拼接成字符串，和完成的字符串比较
    let arr = []
    let str = ''
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        arr.push(this.numbers[i][j])
      }
    }

    str = arr.join(',')
    console.log(str)
    console.log(this.completeStr)
    if (str === this.completeStr) {
      isComplete = true
    } else {
      isComplete = false
    }
    setTimeout(() => {
      if (isComplete) {
        alert('完成')
      }
    }, 100)
  }
}

export default Game
