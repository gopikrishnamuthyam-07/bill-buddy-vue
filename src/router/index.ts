import { createRouter, createMemoryHistory,createWebHashHistory } from 'vue-router';
import homeVue from '../components/home.vue';
import Mysplits from '../components/Mysplits.vue';
import Addsplit from '../components/AddSplits.vue';
import profilePageVue from '@/components/profilePage.vue';
import { useAuth0 } from '@auth0/auth0-vue';
import view from '../components/view.vue';
import Update from '../components/Update.vue';
import CreateGroup from '../components/CreateGroup.vue'
import GroupsComponentVue from '@/components/GroupsComponent.vue';

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: homeVue,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/Mysplits',
      component: Mysplits,
      meta: {
        title: 'My Splits' // Updated title
      }
    },
    {
      path: '/Addsplit',
      component: Addsplit,
      meta: {
        title: 'Add Split' // Updated title
      }
    },
    {
      path: '/profilePage',
      component: profilePageVue,
      meta: {
        title: 'Profile Page' // Updated title
      }
    },
    {
      path: '/view/:id',
      name: 'view',
      component: view,
      meta: {
        title: 'View' // Updated title
      }
    },
    {
      path: '/Update/:id',
      component: Update,
      name: 'Update',
      props: true,
      meta: {
        title: 'Update' // Updated title
      }
    },
    {
      path: '/CreateGroup',
      component: CreateGroup,
      name: 'CreateGroup',
      props: true,
      meta: {
        title: 'CreateGroup' 
      }
    },
    {
      path: '/Groups',
      component: GroupsComponentVue,
      name: 'Groups',
      props: true,
      meta: {
        title: 'Groups' 
      }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (to.path !== '/' && !isAuthenticated) {
    await loginWithRedirect();
  } else {
    next();
  }
});

// This is for dynamic title
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string;

  if (title) {
    document.title = title;
  }

  next();
});

export default router;
