import { toBoolean } from "./appUtils"


export const enablePWAInstallBanner = toBoolean(
  process.env.NEXT_PUBLIC_ENABLE_PWA_INSTALL, 
  false
)

export const cookies = {
  pwaInstallDismissed: {
    name: 'pwa_install_dissmissed'
  }
}
