import {
    reactive,
    toRefs,
    watch
} from 'vue';
import NProgress from "nprogress";

export default function useProgress() {
    const state = reactive({
        loading: false,
    })

    const use = (args) => {
        state.isLoading = args
    }

    watch(() => state.isLoading, (val, prev) => {
        console.log(val,prev);
        if (val) {
            NProgress.start();
        } else {
            NProgress.done();

        }
    });

    return {
        ...toRefs(state),
        use,
    }
}