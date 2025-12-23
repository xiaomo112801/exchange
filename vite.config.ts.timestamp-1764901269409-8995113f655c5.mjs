// vite.config.ts
import process from "node:process";
import Uni from "file:///E:/Code/bitark/node_modules/.pnpm/@uni-helper+plugin-uni@0.1.0_@dcloudio+vite-plugin-uni@3.0.0-4070620250821001_@vueuse+core@11_5nyuq2vsc6w352srwsq325qfzy/node_modules/@uni-helper/plugin-uni/src/index.js";
import UniHelperComponents from "file:///E:/Code/bitark/node_modules/.pnpm/@uni-helper+vite-plugin-uni-components@0.2.3_rollup@4.53.2/node_modules/@uni-helper/vite-plugin-uni-components/dist/index.mjs";
import { WotResolver } from "file:///E:/Code/bitark/node_modules/.pnpm/@uni-helper+vite-plugin-uni-components@0.2.3_rollup@4.53.2/node_modules/@uni-helper/vite-plugin-uni-components/dist/resolvers.mjs";
import UniHelperLayouts from "file:///E:/Code/bitark/node_modules/.pnpm/@uni-helper+vite-plugin-uni-layouts@0.1.11_rollup@4.53.2/node_modules/@uni-helper/vite-plugin-uni-layouts/dist/index.mjs";
import UniHelperManifest from "file:///E:/Code/bitark/node_modules/.pnpm/@uni-helper+vite-plugin-uni-manifest@0.2.10_vite@5.2.8_@types+node@20.16.2_sass@1.78.0_terser@5.31.6_/node_modules/@uni-helper/vite-plugin-uni-manifest/dist/index.mjs";
import UniHelperPages from "file:///E:/Code/bitark/node_modules/.pnpm/@uni-helper+vite-plugin-uni-pages@0.3.22_vite@5.2.8_@types+node@20.16.2_sass@1.78.0_terser@5.31.6_/node_modules/@uni-helper/vite-plugin-uni-pages/dist/index.mjs";
import Optimization from "file:///E:/Code/bitark/node_modules/.pnpm/@uni-ku+bundle-optimizer@1.3.16_@vueuse+core@11.0.3_vue@3.4.38_typescript@5.5.4___postcss@8.5_qm7dkbjip343i6rhn6kd37zlhy/node_modules/@uni-ku/bundle-optimizer/dist/index.mjs";
import UniKuRoot from "file:///E:/Code/bitark/node_modules/.pnpm/@uni-ku+root@1.4.1_vite@5.2.8_@types+node@20.16.2_sass@1.78.0_terser@5.31.6_/node_modules/@uni-ku/root/dist/index.mjs";
import { UniEchartsResolver } from "file:///E:/Code/bitark/node_modules/.pnpm/uni-echarts@2.1.0_echarts@6.0.0_vue@3.4.38_typescript@5.5.4_/node_modules/uni-echarts/dist-resolver/index.mjs";
import { UniEcharts } from "file:///E:/Code/bitark/node_modules/.pnpm/uni-echarts@2.1.0_echarts@6.0.0_vue@3.4.38_typescript@5.5.4_/node_modules/uni-echarts/dist-vite/index.mjs";
import UnoCSS from "file:///E:/Code/bitark/node_modules/.pnpm/unocss@66.0.0_postcss@8.5.6_vite@5.2.8_@types+node@20.16.2_sass@1.78.0_terser@5.31.6__vue@3.4.38_typescript@5.5.4_/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///E:/Code/bitark/node_modules/.pnpm/unplugin-auto-import@0.18.2_@vueuse+core@11.0.3_vue@3.4.38_typescript@5.5.4___rollup@4.53.2/node_modules/unplugin-auto-import/dist/vite.js";
import { defineConfig } from "file:///E:/Code/bitark/node_modules/.pnpm/vite@5.2.8_@types+node@20.16.2_sass@1.78.0_terser@5.31.6/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  optimizeDeps: {
    exclude: process.env.NODE_ENV === "development" ? ["wot-design-uni", "uni-echarts"] : []
  },
  plugins: [
    // https://github.com/uni-helper/vite-plugin-uni-manifest
    UniHelperManifest(),
    // https://github.com/uni-helper/vite-plugin-uni-pages
    UniHelperPages({
      dts: "src/uni-pages.d.ts",
      subPackages: [
        "src/subPages",
        "src/subEcharts",
        "src/subAsyncEcharts"
      ],
      /**
       * 排除的页面，相对于 dir 和 subPackages
       * @default []
       */
      exclude: ["**/components/**/*.*"]
    }),
    // https://github.com/uni-helper/vite-plugin-uni-layouts
    UniHelperLayouts(),
    // https://github.com/uni-helper/vite-plugin-uni-components
    UniHelperComponents({
      resolvers: [WotResolver(), UniEchartsResolver()],
      dts: "src/components.d.ts",
      dirs: ["src/components", "src/business"],
      directoryAsNamespace: true
    }),
    // https://github.com/uni-ku/root
    UniKuRoot(),
    // https://uni-echarts.xiaohe.ink
    UniEcharts(),
    // https://uni-helper.js.org/plugin-uni
    Uni(),
    // https://github.com/uni-ku/bundle-optimizer
    Optimization({
      logger: true
    }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ["vue", "@vueuse/core", "pinia", "uni-app", {
        from: "uni-mini-router",
        imports: ["createRouter", "useRouter", "useRoute"]
      }, {
        from: "wot-design-uni",
        imports: ["useToast", "useMessage", "useNotify", "CommonUtil"]
      }, {
        from: "alova/client",
        imports: ["usePagination", "useRequest"]
      }],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/composables", "src/store", "src/utils", "src/api"],
      vueTemplate: true
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    UnoCSS()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxDb2RlXFxcXGJpdGFya1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcQ29kZVxcXFxiaXRhcmtcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0NvZGUvYml0YXJrL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHByb2Nlc3MgZnJvbSAnbm9kZTpwcm9jZXNzJ1xyXG5pbXBvcnQgVW5pIGZyb20gJ0B1bmktaGVscGVyL3BsdWdpbi11bmknXHJcbmltcG9ydCBVbmlIZWxwZXJDb21wb25lbnRzIGZyb20gJ0B1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1jb21wb25lbnRzJ1xyXG5pbXBvcnQgeyBXb3RSZXNvbHZlciB9IGZyb20gJ0B1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuaW1wb3J0IFVuaUhlbHBlckxheW91dHMgZnJvbSAnQHVuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLWxheW91dHMnXHJcbmltcG9ydCBVbmlIZWxwZXJNYW5pZmVzdCBmcm9tICdAdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktbWFuaWZlc3QnXHJcbmltcG9ydCBVbmlIZWxwZXJQYWdlcyBmcm9tICdAdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktcGFnZXMnXHJcbmltcG9ydCBPcHRpbWl6YXRpb24gZnJvbSAnQHVuaS1rdS9idW5kbGUtb3B0aW1pemVyJ1xyXG5pbXBvcnQgVW5pS3VSb290IGZyb20gJ0B1bmkta3Uvcm9vdCdcclxuaW1wb3J0IHsgVW5pRWNoYXJ0c1Jlc29sdmVyIH0gZnJvbSAndW5pLWVjaGFydHMvcmVzb2x2ZXInXHJcbmltcG9ydCB7IFVuaUVjaGFydHMgfSBmcm9tICd1bmktZWNoYXJ0cy92aXRlJ1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZXhjbHVkZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyBbJ3dvdC1kZXNpZ24tdW5pJywgJ3VuaS1lY2hhcnRzJ10gOiBbXSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1tYW5pZmVzdFxyXG4gICAgVW5pSGVscGVyTWFuaWZlc3QoKSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1wYWdlc1xyXG4gICAgVW5pSGVscGVyUGFnZXMoe1xyXG4gICAgICBkdHM6ICdzcmMvdW5pLXBhZ2VzLmQudHMnLFxyXG4gICAgICBzdWJQYWNrYWdlczogW1xyXG4gICAgICAgICdzcmMvc3ViUGFnZXMnLFxyXG4gICAgICAgICdzcmMvc3ViRWNoYXJ0cycsXHJcbiAgICAgICAgJ3NyYy9zdWJBc3luY0VjaGFydHMnLFxyXG4gICAgICBdLFxyXG4gICAgICAvKipcclxuICAgICAgICogXHU2MzkyXHU5NjY0XHU3Njg0XHU5ODc1XHU5NzYyXHVGRjBDXHU3NkY4XHU1QkY5XHU0RThFIGRpciBcdTU0OEMgc3ViUGFja2FnZXNcclxuICAgICAgICogQGRlZmF1bHQgW11cclxuICAgICAgICovXHJcbiAgICAgIGV4Y2x1ZGU6IFsnKiovY29tcG9uZW50cy8qKi8qLionXSxcclxuICAgIH0pLFxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3VuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLWxheW91dHNcclxuICAgIFVuaUhlbHBlckxheW91dHMoKSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1jb21wb25lbnRzXHJcbiAgICBVbmlIZWxwZXJDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbV290UmVzb2x2ZXIoKSwgVW5pRWNoYXJ0c1Jlc29sdmVyKCldLFxyXG4gICAgICBkdHM6ICdzcmMvY29tcG9uZW50cy5kLnRzJyxcclxuICAgICAgZGlyczogWydzcmMvY29tcG9uZW50cycsICdzcmMvYnVzaW5lc3MnXSxcclxuICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IHRydWUsXHJcbiAgICB9KSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bmkta3Uvcm9vdFxyXG4gICAgVW5pS3VSb290KCksXHJcbiAgICAvLyBodHRwczovL3VuaS1lY2hhcnRzLnhpYW9oZS5pbmtcclxuICAgIFVuaUVjaGFydHMoKSxcclxuICAgIC8vIGh0dHBzOi8vdW5pLWhlbHBlci5qcy5vcmcvcGx1Z2luLXVuaVxyXG4gICAgVW5pKCksXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW5pLWt1L2J1bmRsZS1vcHRpbWl6ZXJcclxuICAgIE9wdGltaXphdGlvbih7XHJcbiAgICAgIGxvZ2dlcjogdHJ1ZSxcclxuICAgIH0pLFxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0XHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgaW1wb3J0czogWyd2dWUnLCAnQHZ1ZXVzZS9jb3JlJywgJ3BpbmlhJywgJ3VuaS1hcHAnLCB7XHJcbiAgICAgICAgZnJvbTogJ3VuaS1taW5pLXJvdXRlcicsXHJcbiAgICAgICAgaW1wb3J0czogWydjcmVhdGVSb3V0ZXInLCAndXNlUm91dGVyJywgJ3VzZVJvdXRlJ10sXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBmcm9tOiAnd290LWRlc2lnbi11bmknLFxyXG4gICAgICAgIGltcG9ydHM6IFsndXNlVG9hc3QnLCAndXNlTWVzc2FnZScsICd1c2VOb3RpZnknLCAnQ29tbW9uVXRpbCddLFxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgZnJvbTogJ2Fsb3ZhL2NsaWVudCcsXHJcbiAgICAgICAgaW1wb3J0czogWyd1c2VQYWdpbmF0aW9uJywgJ3VzZVJlcXVlc3QnXSxcclxuICAgICAgfV0sXHJcbiAgICAgIGR0czogJ3NyYy9hdXRvLWltcG9ydHMuZC50cycsXHJcbiAgICAgIGRpcnM6IFsnc3JjL2NvbXBvc2FibGVzJywgJ3NyYy9zdG9yZScsICdzcmMvdXRpbHMnLCAnc3JjL2FwaSddLFxyXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcclxuICAgIH0pLFxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3Vub2Nzc1xyXG4gICAgLy8gc2VlIHVub2Nzcy5jb25maWcudHMgZm9yIGNvbmZpZ1xyXG4gICAgVW5vQ1NTKCksXHJcbiAgXSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrTyxPQUFPLGFBQWE7QUFDdFAsT0FBTyxTQUFTO0FBQ2hCLE9BQU8seUJBQXlCO0FBQ2hDLFNBQVMsbUJBQW1CO0FBQzVCLE9BQU8sc0JBQXNCO0FBQzdCLE9BQU8sdUJBQXVCO0FBQzlCLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sa0JBQWtCO0FBQ3pCLE9BQU8sZUFBZTtBQUN0QixTQUFTLDBCQUEwQjtBQUNuQyxTQUFTLGtCQUFrQjtBQUMzQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxvQkFBb0I7QUFFN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsY0FBYztBQUFBLElBQ1osU0FBUyxRQUFRLElBQUksYUFBYSxnQkFBZ0IsQ0FBQyxrQkFBa0IsYUFBYSxJQUFJLENBQUM7QUFBQSxFQUN6RjtBQUFBLEVBQ0EsU0FBUztBQUFBO0FBQUEsSUFFUCxrQkFBa0I7QUFBQTtBQUFBLElBRWxCLGVBQWU7QUFBQSxNQUNiLEtBQUs7QUFBQSxNQUNMLGFBQWE7QUFBQSxRQUNYO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtBLFNBQVMsQ0FBQyxzQkFBc0I7QUFBQSxJQUNsQyxDQUFDO0FBQUE7QUFBQSxJQUVELGlCQUFpQjtBQUFBO0FBQUEsSUFFakIsb0JBQW9CO0FBQUEsTUFDbEIsV0FBVyxDQUFDLFlBQVksR0FBRyxtQkFBbUIsQ0FBQztBQUFBLE1BQy9DLEtBQUs7QUFBQSxNQUNMLE1BQU0sQ0FBQyxrQkFBa0IsY0FBYztBQUFBLE1BQ3ZDLHNCQUFzQjtBQUFBLElBQ3hCLENBQUM7QUFBQTtBQUFBLElBRUQsVUFBVTtBQUFBO0FBQUEsSUFFVixXQUFXO0FBQUE7QUFBQSxJQUVYLElBQUk7QUFBQTtBQUFBLElBRUosYUFBYTtBQUFBLE1BQ1gsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUFBO0FBQUEsSUFFRCxXQUFXO0FBQUEsTUFDVCxTQUFTLENBQUMsT0FBTyxnQkFBZ0IsU0FBUyxXQUFXO0FBQUEsUUFDbkQsTUFBTTtBQUFBLFFBQ04sU0FBUyxDQUFDLGdCQUFnQixhQUFhLFVBQVU7QUFBQSxNQUNuRCxHQUFHO0FBQUEsUUFDRCxNQUFNO0FBQUEsUUFDTixTQUFTLENBQUMsWUFBWSxjQUFjLGFBQWEsWUFBWTtBQUFBLE1BQy9ELEdBQUc7QUFBQSxRQUNELE1BQU07QUFBQSxRQUNOLFNBQVMsQ0FBQyxpQkFBaUIsWUFBWTtBQUFBLE1BQ3pDLENBQUM7QUFBQSxNQUNELEtBQUs7QUFBQSxNQUNMLE1BQU0sQ0FBQyxtQkFBbUIsYUFBYSxhQUFhLFNBQVM7QUFBQSxNQUM3RCxhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUE7QUFBQTtBQUFBLElBR0QsT0FBTztBQUFBLEVBQ1Q7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
