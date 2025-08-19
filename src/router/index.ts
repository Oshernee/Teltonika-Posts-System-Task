import { createRouter, createWebHistory } from 'vue-router'
import PostsView from '../views/PostsView.vue'
import AuthorsView from '../views/AuthorsView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '',
          name: 'posts',
          alias: ['/posts', '/'],
          component: PostsView,
        },
        {
          path: '/posts/:id',
          name: 'post-detail',
          component: PostDetailView,
        },
      ],
    },
    {
      path: '/authors',
      name: 'authors',
      component: AuthorsView,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

export default router
