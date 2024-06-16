import { createRouter, createWebHistory } from 'vue-router'
import MyHome from '@/views/MyHome.vue'
import { useMainStore } from '@/store/store';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'MyIndex',
      component: MyHome
    },
    {
      path: '/aboutMe',
      name: 'AboutMe',
      component: () => import('@/views/AboutMe.vue')
    },

    {
      path: '/photo',
      name: 'MyPhoto',
      component: () => import('@/views/MyPhoto.vue')
    },
    {
      path: '/message',
      name: 'MyMessage',
      component: () => import('@/views/MyMessage.vue')
    },
    {
      path: '/music',
      name: 'MyMusic',
      component: () => import('@/views/MyMusic.vue'),
      children: [
        {
          path: 'discover',
          name: 'discover',
          component: () => import('@/views/music/discover.vue')
        },
        {
          path: 'topList',
          name: 'topList',
          component: () => import('@/views/music/topList.vue')
        },
        {
          path: 'singer',
          name: 'singer',
          component: () => import('@/views/music/singer.vue')
        },
        {
          path: 'newest',
          name: 'newest',
          component: () => import('@/views/music/newest.vue')
        },
        {
          path: 'songList',
          name: 'songList',
          component: () => import('@/views/music/songList.vue')
        },
        {
          path: 'exclusive',
          name: 'exclusive',
          component: () => import('@/views/music/exclusive.vue')
        }
      ]
    },
    {
      path: '/blog',
      name: 'MyBlog',
      component: () => import('@/views/MyBlog.vue')
    },
    {
      path: '/blog/detail',
      name: 'BlogDetail',
      component: () => import('@/views/BlogDetail.vue')
    },
    {
      path: '/editor',
      name: 'BlogEditor',
      component: () => import('@/views/MyEditor.vue'),
      meta:{requiresAuth:true}
    },
    {
      path: '/manage',
      name: 'BlogManage',
      component: () => import('@/views/BlogManage.vue'),
      meta:{requiresAuth:true}
    },
    {
      path: '/essay',
      name: 'MyEssay',
      component: () => import('@/views/MyEssay.vue')
    },
    {
      path: '/password',
      name: 'PasswordPrompt',
      component: () => import('@/components/PasswordPrompt.vue')
    }
  ]
})


router.beforeEach((to, from, next) => {
  const mainStore = useMainStore()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!mainStore.passwordVerified) {
      next({
        path: '/password',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
