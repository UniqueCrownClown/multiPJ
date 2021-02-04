<template>
  <div class="layout-wrapper">
    <div class="layout-header">
      <div class="logo">QIANKUN</div>
      <ul class="sub-apps">
        <li
          v-for="item in data.microApps"
          :class="{ active: item.activeRule === data.current }"
          :key="item.name"
          @click="goto(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="userinfo">主应用的state：{{ JSON.stringify(user) }}</div>
    </div>
    <div id="subapp-viewport"></div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from "vue";
import mitt from "mitt";
import NProgress from "nprogress";
import microApps from "./micro-app";
import store from "@/store";
export default {
  name: "App",
  setup(props, context) {
    onMounted(() => {
      listenRouterChange();
    });
    const data = reactive({
      microApps,
      current: "/sub-vue",
    });
    const user = computed(() => store.getGlobalState("user"));
    function goto(item) {
      history.pushState(null, item.activeRule, item.activeRule);
      // this.data.current = item.name
    }
    function bindCurrent() {
      const path = window.location.pathname;
      if (microApps.findIndex((item) => item.activeRule === path) >= 0) {
        data.current = path;
      }
    }
    function listenRouterChange() {
      const _wr = function (type) {
        const orig = history[type];
        return function () {
          const rv = orig.apply(this, arguments);
          const e = new Event(type);
          e.arguments = arguments;
          window.dispatchEvent(e);
          return rv;
        };
      };
      history.pushState = _wr("pushState");

      window.addEventListener("pushState", bindCurrent);
      window.addEventListener("popstate", bindCurrent);
      const emitter = mitt();
      emitter.emit("hook:beforeDestroy", () => {
        window.removeEventListener("pushState", bindCurrent);
        window.removeEventListener("popstate", bindCurrent);
      });
      // this.$once('hook:beforeDestroy', () => {
      //   window.removeEventListener('pushState', bindCurrent)
      //   window.removeEventListener('popstate', bindCurrent)
      // })
    }
    console.log(props, context);

    bindCurrent();
    NProgress.start();
    return {
      data,
      user,
      goto,
    };
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0 !important;
  padding: 0;
}
.github-corner:hover .octo-arm {
  animation: octocat-wave 560ms ease-in-out;
}
@keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0);
  }
  20%,
  60% {
    transform: rotate(-25deg);
  }
  40%,
  80% {
    transform: rotate(10deg);
  }
}
@media (max-width: 500px) {
  .github-corner:hover .octo-arm {
    animation: none;
  }
  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}
.layout-wrapper {
  .layout-header {
    height: 50px;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    line-height: 50px;
    position: relative;
    .logo {
      float: left;
      margin: 0 50px;
    }
    .sub-apps {
      list-style: none;
      margin: 0;
      li {
        list-style: none;
        display: inline-block;
        padding: 0 20px;
        cursor: pointer;
        &.active {
          color: #42b983;
          text-decoration: underline;
        }
      }
    }
    .userinfo {
      position: absolute;
      right: 100px;
      top: 0;
    }
  }
}
</style>
