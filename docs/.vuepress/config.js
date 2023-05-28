module.exports = {
  head: [["link", { rel: "icon", href: "logo.png" }]],
  port: "8099",
  title: "zzj的小站",
  description: "我的小站",
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "首页", link: "/" },
      { text: "面试", link: "/interview/" },
      { text: "算法", link: "/algorithm/" },
      { text: "github", link: "https://github.com/geekZZJ" },
    ],
    sidebar: {
      "/interview/": [
        {
          title: "面试",
          collapsable: false,
          children: [
            "",
            "css",
            "js",
            "network",
            "browser",
            "all",
            "utilFun",
            "vue",
            "react",
            "webpack",
            "project",
            "git",
          ],
        },
      ],
      "/algorithm/": [
        {
          title: "算法",
          collapsable: false,
          children: [""],
        },
      ],
    },
  },
};
