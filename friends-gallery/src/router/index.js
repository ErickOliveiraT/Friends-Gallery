import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SignUpPage from '../views/SignUpPage.vue';
import PhotosPage from '../views/PhotosPage.vue';
import { Auth } from 'aws-amplify';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'SignUpPage',
    component: SignUpPage
  },
  {
    path: '/photos',
    name: 'PhotosPage',
    component: PhotosPage,
    meta: {requiresAuth: true}
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = await Auth.currentUserInfo();

  if (requiresAuth && !isAuthenticated) next("/");
  else next();
})

export default router;