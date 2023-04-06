<template>
  <div ref="threeDiv" class="threeDiv">
    <div class="layer">

      <div v-if="currentMoreIcon.show" ref="moreIcon" class="moreIcon" :style="{
        left: currentMoreIcon.position.x + 'px',
        top: currentMoreIcon.position.y + 'px'
      }" />

      <div v-if="currentMoreIcon.show" ref="questionList" class="questionList" :style="{
        left: questionPosition.x + 'px',
        top: questionPosition.y + 'px'
      }">
        <div v-for="item in currentMoreIcon.question"
          :class="`questionItem ${!currentQuestionAnswer || item.answer === currentQuestionAnswer ? 'active' : ''}`"
          @click="handleClickQuestionItem(item)">
          {{ item.text }}
        </div>
      </div>

      <div ref="targetPoint" class="targetPoint" />

      <div v-if="currentRichText" class="modal">
        <div class="content" v-html="currentRichText" />
        <div class="btnGroup">
          <div class="modalBtn" @click="currentRichText = ''">
            <img src="@/assets/images/3d/close.svg" alt="">
            <span>关闭</span>
          </div>
        </div>
      </div>
      <div v-if="currentQuestionAnswer" class="modal">
        <div class="content">
          {{ currentQuestionAnswer }}
        </div>
        <div class="btnGroup">
          <div class="modalBtn" @click="currentQuestionAnswer = ''">
            <img src="@/assets/images/3d/speaker.svg" alt="">
            <span>讲解</span>
          </div>
          <div class="modalBtn" @click="currentQuestionAnswer = ''">
            <img src="@/assets/images/3d/close.svg" alt="">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as THREE from 'three';
import Scene from '@/three/scene';
import { createGLTFLoader } from '@/three/loaders';

const config = {
  Mesh1007_3: {
    type: 1,
    richText:
      "<div><p>听见外滩的熙攘声（关于这个事件的标题）</p><audio src=''></audio><p>建议用户在上传音频时，尽量同步提交音频所对应的文本，以便观众在浏览时获得更良好的体验。Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。</p><div>"
  },
  Mesh1823_20: {
    type: 2,
    question: [
      {
        text: '名字的由来',
        answer: '我取的'
      },
      {
        text: '发生在这里的故事？',
        answer:
          '外滩是上海市中心的一个著名地标，它位于黄浦江畔，是一个历史悠久、文化底蕴深厚的地方。外滩因其独特的建筑风格和美丽的景色而成为了游客和当地人喜爱的旅游景点之一。据传说，外滩最初是由一群逃避战乱的人建造的，他们在这里建起了简单的房屋和码头，以便将货物运往中国内地。随着时间的推移，外滩逐渐发展成为了上海的一个商业和文化中心。在上世纪二三十年代，许多外国富商和政要在外滩居住和工作，这也使得外滩成为了一个国际化的地方。在这个时期，外滩的建筑风格更加多样化，包括欧式建筑、中式建筑和现代建筑等。在新中国成立后，外滩的商业和文化中心地位逐渐被取代，但它仍然是上海的一个重要地标，吸引着大量游客前来参观和体验上海的独特文化和风情。'
      },
      {
        text:
          '为什么当代作家路遥在《平凡的世界》里写道：外滩的人群，熙熙攘攘，充满了生机和活力。',
        answer: '因为所以'
      }
    ]
  }
};

export default {
  name: 'Three3d',
  data() {
    return {
      infoTags: {},
      moreTags: {},
      currentRichText: '',
      currentMoreIcon: {
        position: {},
        question: [],
        show: false
      },
      currentQuestionAnswer: '',
      questionPosition: {
        x: 0,
        y: 0
      },
      scene: null
    };
  },
  watch: {
    currentRichText(value) {
      this.scene.setControllerEnable(!value);
    },
    currentQuestionAnswer(value) {
      this.scene.setControllerEnable(!value);
    }
  },
  mounted() {
    this.scene = new Scene(this.$refs['threeDiv']);
    const loader = createGLTFLoader('static/draco');
    loader.load(
      '/static/cityDemo.glb',
      this.handleLoadDone,
      this.handleLoadProgress
    );
  },
  methods: {
    handleClickQuestionItem(item) {
      if (!this.currentQuestionAnswer) {
        const targetPointBox = this.$refs['targetPoint'].getBoundingClientRect();
        const startPointBox = this.$refs['moreIcon'].getBoundingClientRect();
        this.scene.rotateCamera({ x: startPointBox.left, y: startPointBox.top }, { x: targetPointBox.left, y: targetPointBox.top });
      }
      this.currentQuestionAnswer = item.answer;
    },
    handleLoadProgress(progressEvent) {
      const { total, loader } = progressEvent;
      console.log(total, loader);
    },
    handleLoadDone(gltf) {
      console.log(gltf);
      this.scene.addModels([gltf.scene], config);
      this.scene.on('onUpdate', interObj => {
        // console.log(1)
        if (this.currentMoreIcon.show) {
          this.currentMoreIcon.show = false;
        }
      });
      this.scene.on('onSelect', obj => {
        console.log(obj);
        const userData = obj.userData;
        if (userData.type === 1) {
          // 富文本框
          const { richText } = userData;
          this.currentRichText = richText;
        } else if (userData.type === 2) {
          // 计算点击icon的屏幕坐标
          const objBox = new THREE.Box3().setFromObject(obj);
          const objBoxCenter = objBox.getCenter(new THREE.Vector3());
          const width = this.$refs['threeDiv'].offsetWidth;
          const height = this.$refs['threeDiv'].offsetHeight;
          const worldVector = new THREE.Vector3(
            objBoxCenter.x,
            objBoxCenter.y,
            objBoxCenter.z
          );
          // 三维坐标转二维
          const vector = worldVector.project(this.scene.camera);
          const x = Math.round(((1 + vector.x) * width) / 2);
          const y = Math.round(((1 - vector.y) * height) / 2);

          this.currentMoreIcon.position = { x, y };
          this.currentMoreIcon.question = userData.question;
          this.currentMoreIcon.show = true;

          this.$nextTick(() => {
            // 计算moreIcon 据边缘距离
            const moreIconBox = this.$refs[
              'moreIcon'
            ].getBoundingClientRect();
            const questionBox = this.$refs[
              'questionList'
            ].getBoundingClientRect();
            let questionX = x;
            const alignLeft = window.innerWidth - moreIconBox.right < questionBox.width;
            if (alignLeft) {
              questionX = x - questionBox.width;
            }

            this.questionPosition = { x: questionX, y };

            this.$nextTick(() => {
              // 调整questionItem 位置
              const questionItems = this.$refs[
                'questionList'
              ].querySelectorAll('.questionItem');
              questionItems.forEach(question => {
                const questionItemBox = question.getBoundingClientRect();
                if (
                  !(
                    questionItemBox.top > moreIconBox.bottom ||
                    questionItemBox.right < moreIconBox.left ||
                    questionItemBox.bottom < moreIconBox.top ||
                    questionItemBox.left > moreIconBox.right
                  )
                ) {
                  // 和moreIcon重叠
                  const offsetX = alignLeft ? -moreIconBox.width / 2 : moreIconBox.width / 2;
                  question.style.transform = `translateX(${offsetX}px)`;
                }
              });
            });
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.threeDiv {
  height: 100vh;

  .layer {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    pointer-events: none;

    .targetPoint {
      position: absolute;
      left: 11.925rem;
      top: 6.305rem;
      width: 0;
      height: 0;
    }

    .moreIcon {
      width: 0.77rem;
      height: 1.1rem;
      position: absolute;
      transform: translate(-50%, -50%);
    }

    .questionList {
      position: absolute;
      transform: translateY(-50%);
      font-size: 0.24rem;

      .questionItem {
        background: #fff;
        box-shadow: 0rem 0.03rem 0.03rem 0.01rem rgba(0, 0, 0, 0.25);
        border-radius: 0.25rem 0.25rem 0.25rem 0.25rem;
        max-width: 3.24rem;
        padding: 0.08rem 0.28rem 0.11rem;
        margin-top: 0.12rem;
        pointer-events: auto;
        opacity: 0.5;

        &.active {
          opacity: 1;

        }
      }
    }

    .modal {
      pointer-events: auto;
      font-size: 0.24rem;
      padding: 0.5rem;
      width: 10rem;
      max-height: 7.5rem;
      background: #fff;
      box-shadow: 0rem 0.03rem 0.03rem 0.01rem rgba(0, 0, 0, 0.25);
      border-radius: 0.25rem 0.25rem 0.25rem 0.25rem;
      position: absolute;
      left: 50%;
      bottom: 1.81rem;
      transform: translateX(-8.3rem);

      .content {
        overflow-y: auto;
        height: 100%;
      }

      .btnGroup {
        position: absolute;
        bottom: -0.75rem;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .modalBtn {
          margin: 0 0.125rem;
          padding: 0 0.3rem;
          height: 0.5rem;
          line-height: 0.5rem;
          background: #fff;
          box-shadow: 0rem 0.03rem 0.03rem 0.01rem rgba(0, 0, 0, 0.25);
          border-radius: 0.25rem 0.25rem 0.25rem 0.25rem;

          img {
            width: 0.17rem;
          }
        }
      }
    }
  }
}
</style>

