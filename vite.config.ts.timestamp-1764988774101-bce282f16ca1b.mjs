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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxDb2RlXFxcXGJpdGFya1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcQ29kZVxcXFxiaXRhcmtcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0NvZGUvYml0YXJrL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHByb2Nlc3MgZnJvbSAnbm9kZTpwcm9jZXNzJ1xuaW1wb3J0IFVuaSBmcm9tICdAdW5pLWhlbHBlci9wbHVnaW4tdW5pJ1xuaW1wb3J0IFVuaUhlbHBlckNvbXBvbmVudHMgZnJvbSAnQHVuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLWNvbXBvbmVudHMnXG5pbXBvcnQgeyBXb3RSZXNvbHZlciB9IGZyb20gJ0B1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1jb21wb25lbnRzL3Jlc29sdmVycydcbmltcG9ydCBVbmlIZWxwZXJMYXlvdXRzIGZyb20gJ0B1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1sYXlvdXRzJ1xuaW1wb3J0IFVuaUhlbHBlck1hbmlmZXN0IGZyb20gJ0B1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1tYW5pZmVzdCdcbmltcG9ydCBVbmlIZWxwZXJQYWdlcyBmcm9tICdAdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktcGFnZXMnXG5pbXBvcnQgT3B0aW1pemF0aW9uIGZyb20gJ0B1bmkta3UvYnVuZGxlLW9wdGltaXplcidcbmltcG9ydCBVbmlLdVJvb3QgZnJvbSAnQHVuaS1rdS9yb290J1xuaW1wb3J0IHsgVW5pRWNoYXJ0c1Jlc29sdmVyIH0gZnJvbSAndW5pLWVjaGFydHMvcmVzb2x2ZXInXG5pbXBvcnQgeyBVbmlFY2hhcnRzIH0gZnJvbSAndW5pLWVjaGFydHMvdml0ZSdcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IFsnd290LWRlc2lnbi11bmknLCAndW5pLWVjaGFydHMnXSA6IFtdLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3VuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLW1hbmlmZXN0XG4gICAgVW5pSGVscGVyTWFuaWZlc3QoKSxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktcGFnZXNcbiAgICBVbmlIZWxwZXJQYWdlcyh7XG4gICAgICBkdHM6ICdzcmMvdW5pLXBhZ2VzLmQudHMnLFxuICAgICAgc3ViUGFja2FnZXM6IFtcbiAgICAgICAgJ3NyYy9zdWJQYWdlcycsXG4gICAgICAgICdzcmMvc3ViRWNoYXJ0cycsXG4gICAgICAgICdzcmMvc3ViQXN5bmNFY2hhcnRzJyxcbiAgICAgIF0sXG4gICAgICAvKipcbiAgICAgICAqIFx1NjM5Mlx1OTY2NFx1NzY4NFx1OTg3NVx1OTc2Mlx1RkYwQ1x1NzZGOFx1NUJGOVx1NEU4RSBkaXIgXHU1NDhDIHN1YlBhY2thZ2VzXG4gICAgICAgKiBAZGVmYXVsdCBbXVxuICAgICAgICovXG4gICAgICBleGNsdWRlOiBbJyoqL2NvbXBvbmVudHMvKiovKi4qJ10sXG4gICAgfSksXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3VuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLWxheW91dHNcbiAgICBVbmlIZWxwZXJMYXlvdXRzKCksXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3VuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLWNvbXBvbmVudHNcbiAgICBVbmlIZWxwZXJDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW1dvdFJlc29sdmVyKCksIFVuaUVjaGFydHNSZXNvbHZlcigpXSxcbiAgICAgIGR0czogJ3NyYy9jb21wb25lbnRzLmQudHMnLFxuICAgICAgZGlyczogWydzcmMvY29tcG9uZW50cycsICdzcmMvYnVzaW5lc3MnXSxcbiAgICAgIGRpcmVjdG9yeUFzTmFtZXNwYWNlOiB0cnVlLFxuICAgIH0pLFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bmkta3Uvcm9vdFxuICAgIFVuaUt1Um9vdCgpLFxuICAgIC8vIGh0dHBzOi8vdW5pLWVjaGFydHMueGlhb2hlLmlua1xuICAgIFVuaUVjaGFydHMoKSxcbiAgICAvLyBodHRwczovL3VuaS1oZWxwZXIuanMub3JnL3BsdWdpbi11bmlcbiAgICBVbmkoKSxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW5pLWt1L2J1bmRsZS1vcHRpbWl6ZXJcbiAgICBPcHRpbWl6YXRpb24oe1xuICAgICAgbG9nZ2VyOiB0cnVlLFxuICAgIH0pLFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW1wb3J0czogWyd2dWUnLCAnQHZ1ZXVzZS9jb3JlJywgJ3BpbmlhJywgJ3VuaS1hcHAnLCB7XG4gICAgICAgIGZyb206ICd1bmktbWluaS1yb3V0ZXInLFxuICAgICAgICBpbXBvcnRzOiBbJ2NyZWF0ZVJvdXRlcicsICd1c2VSb3V0ZXInLCAndXNlUm91dGUnXSxcbiAgICAgIH0sIHtcbiAgICAgICAgZnJvbTogJ3dvdC1kZXNpZ24tdW5pJyxcbiAgICAgICAgaW1wb3J0czogWyd1c2VUb2FzdCcsICd1c2VNZXNzYWdlJywgJ3VzZU5vdGlmeScsICdDb21tb25VdGlsJ10sXG4gICAgICB9LCB7XG4gICAgICAgIGZyb206ICdhbG92YS9jbGllbnQnLFxuICAgICAgICBpbXBvcnRzOiBbJ3VzZVBhZ2luYXRpb24nLCAndXNlUmVxdWVzdCddLFxuICAgICAgfV0sXG4gICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgZGlyczogWydzcmMvY29tcG9zYWJsZXMnLCAnc3JjL3N0b3JlJywgJ3NyYy91dGlscycsICdzcmMvYXBpJ10sXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgICB9KSxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5vY3NzXG4gICAgLy8gc2VlIHVub2Nzcy5jb25maWcudHMgZm9yIGNvbmZpZ1xuICAgIFVub0NTUygpLFxuICBdLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa08sT0FBTyxhQUFhO0FBQ3RQLE9BQU8sU0FBUztBQUNoQixPQUFPLHlCQUF5QjtBQUNoQyxTQUFTLG1CQUFtQjtBQUM1QixPQUFPLHNCQUFzQjtBQUM3QixPQUFPLHVCQUF1QjtBQUM5QixPQUFPLG9CQUFvQjtBQUMzQixPQUFPLGtCQUFrQjtBQUN6QixPQUFPLGVBQWU7QUFDdEIsU0FBUywwQkFBMEI7QUFDbkMsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsb0JBQW9CO0FBRTdCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLGNBQWM7QUFBQSxJQUNaLFNBQVMsUUFBUSxJQUFJLGFBQWEsZ0JBQWdCLENBQUMsa0JBQWtCLGFBQWEsSUFBSSxDQUFDO0FBQUEsRUFDekY7QUFBQSxFQUNBLFNBQVM7QUFBQTtBQUFBLElBRVAsa0JBQWtCO0FBQUE7QUFBQSxJQUVsQixlQUFlO0FBQUEsTUFDYixLQUFLO0FBQUEsTUFDTCxhQUFhO0FBQUEsUUFDWDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLQSxTQUFTLENBQUMsc0JBQXNCO0FBQUEsSUFDbEMsQ0FBQztBQUFBO0FBQUEsSUFFRCxpQkFBaUI7QUFBQTtBQUFBLElBRWpCLG9CQUFvQjtBQUFBLE1BQ2xCLFdBQVcsQ0FBQyxZQUFZLEdBQUcsbUJBQW1CLENBQUM7QUFBQSxNQUMvQyxLQUFLO0FBQUEsTUFDTCxNQUFNLENBQUMsa0JBQWtCLGNBQWM7QUFBQSxNQUN2QyxzQkFBc0I7QUFBQSxJQUN4QixDQUFDO0FBQUE7QUFBQSxJQUVELFVBQVU7QUFBQTtBQUFBLElBRVYsV0FBVztBQUFBO0FBQUEsSUFFWCxJQUFJO0FBQUE7QUFBQSxJQUVKLGFBQWE7QUFBQSxNQUNYLFFBQVE7QUFBQSxJQUNWLENBQUM7QUFBQTtBQUFBLElBRUQsV0FBVztBQUFBLE1BQ1QsU0FBUyxDQUFDLE9BQU8sZ0JBQWdCLFNBQVMsV0FBVztBQUFBLFFBQ25ELE1BQU07QUFBQSxRQUNOLFNBQVMsQ0FBQyxnQkFBZ0IsYUFBYSxVQUFVO0FBQUEsTUFDbkQsR0FBRztBQUFBLFFBQ0QsTUFBTTtBQUFBLFFBQ04sU0FBUyxDQUFDLFlBQVksY0FBYyxhQUFhLFlBQVk7QUFBQSxNQUMvRCxHQUFHO0FBQUEsUUFDRCxNQUFNO0FBQUEsUUFDTixTQUFTLENBQUMsaUJBQWlCLFlBQVk7QUFBQSxNQUN6QyxDQUFDO0FBQUEsTUFDRCxLQUFLO0FBQUEsTUFDTCxNQUFNLENBQUMsbUJBQW1CLGFBQWEsYUFBYSxTQUFTO0FBQUEsTUFDN0QsYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBO0FBQUE7QUFBQSxJQUdELE9BQU87QUFBQSxFQUNUO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
