const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("pages/InboxPage.vue"),
        name: "inbox",
      },
      {
        path: "/drafts",
        component: () => import("pages/DraftsPage.vue"),
        name: "drafts",
      },
      {
        path: "/sent",
        component: () => import("pages/SentPage.vue"),
        name: "sent",
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
