/**
 * containerHeight: 容器高度
 * itemHeight: 每项高度
 * totalItems: 总数据量
 * bufferSize: 缓冲区大小
 * renderItem: 渲染函数
 */


class VirtualScroll {
    constructor(options) {
        this.containerHeight = options.containerHeight;    // 容器高度
        this.itemHeight = options.itemHeight;             // 每项高度
        this.totalItems = options.totalItems;             // 总数据量
        this.bufferSize = options.bufferSize || 5;        // 缓冲区大小
        this.renderItem = options.renderItem;             // 渲染函数

        // 初始化容器，设置容器高度
        this.container = document.createElement('div');
        this.container.style.cssText = `
        height: ${this.containerHeight}px;
        overflow-y: auto;
        position: relative;
      `;

        // 创建内容容器
        this.content = document.createElement('div');
        this.content.style.position = 'relative';
        this.container.appendChild(this.content);

        // 计算可视区域显示数量
        this.visibleItems = Math.ceil(this.containerHeight / this.itemHeight);
        // 计算内容容器高度
        this.totalHeight = this.totalItems * this.itemHeight;
        this.content.style.height = `${this.totalHeight}px`;

        // 绑定滚动事件
        this.lastScrollTop = 0;
        this.container.addEventListener('scroll', this.onScroll.bind(this));

        // 初始渲染
        this.items = [];
        this.startIndex = 0;
        this.endIndex = this.visibleItems + this.bufferSize;
        this.render();
    }

    onScroll() {
        const scrollTop = this.container.scrollTop;
        const newStartIndex = Math.floor(scrollTop / this.itemHeight);

        // 判断是否需要更新
        if (newStartIndex !== this.startIndex) {
            this.startIndex = Math.max(0, newStartIndex - this.bufferSize);
            this.endIndex = Math.min(
                this.totalItems,
                newStartIndex + this.visibleItems + this.bufferSize
            );
            this.render();
        }

        this.lastScrollTop = scrollTop;
    }

    render() {
        // 清空现有内容
        this.content.innerHTML = '';
        this.items = [];

        // 渲染可见区域的项
        for (let i = this.startIndex; i < this.endIndex; i++) {
            const item = document.createElement('div');
            item.style.cssText = `
          position: absolute;
          top: ${i * this.itemHeight}px;
          width: 100%;
          height: ${this.itemHeight}px;
        `;

            // 调用自定义渲染函数
            this.renderItem(item, i);
            this.content.appendChild(item);
            this.items.push(item);
        }
    }

    // 挂载到DOM
    mount(parent) {
        parent.appendChild(this.container);
    }

    // 更新数据
    updateData(newTotalItems) {
        this.totalItems = newTotalItems;
        this.totalHeight = this.totalItems * this.itemHeight;
        this.content.style.height = `${this.totalHeight}px`;
        this.render();
    }
}