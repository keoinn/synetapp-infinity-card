<script setup>
import { computed } from 'vue'
import weproLogo from '@/assets/wepro-logo.webp'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const footerHeight = computed(() => {
  //   console.log(window.innerHeight)
  //   console.log(Math.floor(window.innerHeight * (314 / 1338)))
  //   return Math.floor(window.innerHeight * (314 / 1338))
  return 150
})
</script>

<template>
  <v-footer
    :height="footerHeight"
    app
    class="footer d-none d-sm-flex"
    style="position: absolute; left: 0; right: 0; z-index: 100; width: 100%"
  >
    <v-row>
      <v-col
        cols="4"
        md="4"
        sm="12"
      >
        <div class="footer-label-title">無限可能卡</div>
        <div class="footer-label-sub-title">Infinity Card</div>
        <div class="footer-label-social-icon">
          <v-icon
            size="32"
            class="mr-2"
            icon="mdi-shopping-outline"
          />
          <v-icon
            size="32"
            class="mr-2"
            icon="mdi-email-outline"
          />
          <v-icon
            size="32"
            class="mr-2"
            icon="mdi-facebook"
          />
          <v-icon
            size="32"
            class="mr-2"
            icon="mdi-instagram"
          />
          <v-icon
            size="32"
            class="mr-2"
            icon="mdi-youtube"
          />
        </div>
      </v-col>

      <v-col
        cols="1"
        class="d-none d-lg-flex"
      >
        <ul class="footer-item-list">
          <li> {{ t('navigation.sitemap') }} </li>
          <li>
            <router-link to="/news">
              {{ t('common.news') }}
            </router-link>
          </li>
          <li>
            <router-link to="/shop">
              {{ t('common.shop') }}
            </router-link>
          </li>
          <li>
            <router-link to="/about">
              {{ t('common.about') }}
            </router-link>
          </li>
        </ul>
      </v-col>

      <v-col
        cols="4"
        lg="4"
        md="8"
        class="d-none d-md-flex"
      >
        <ul class="footer-item-list">
          <li>{{ t('navigation.contactUs') }}</li>
          <li>{{ t('navigation.serviceHotLine') }}: {{ t('customString.serviceHotLine') }}</li>
          <li>{{ t('navigation.serviceMail') }}: service@infinitycard.com.tw</li>
          <li>{{ t('navigation.serviceTime') }}: {{ t('customString.serviceTime') }}</li>
        </ul>
      </v-col>

      <v-col
        cols="3"
        class="d-none d-lg-flex"
      >
        <div class="footer-wepro-logo">
          <img
            :src="weproLogo"
            alt="Wepro Logo"
          />
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style scoped lang="scss">
.footer {
  background-color: #52282a;
  color: #fff;
}

.footer-label-title {
  text-align: center;
  font-size: 44px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.footer-label-sub-title {
  text-align: center;
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 7.56px;
}

.footer-label-social-icon {
  display: flex;
  justify-content: center;
  margin-left: -30px;
  padding-top: 5px;
}

.footer-item-list {
  font-size: 16px;
  list-style: none;

  :first-child {
    font-weight: bold;
    padding-bottom: 20px;
  }

  a {
    text-decoration: none;
    color: #fff;
  }
}

.footer-wepro-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #fff;
  width: 125px;
  height: 125px;

  img {
    width: 100px;
    height: 100px;
  }
}
</style>
