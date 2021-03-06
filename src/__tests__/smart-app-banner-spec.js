jest.disableAutomock()

import React from 'react'
import ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import CloseButton from '../close-button'
import ReactSmartAppBanner from '../smart-app-banner'

describe('ReactSmartAppBanner', () => {
  var component
  const __origNav = window.navigator
  const __origLocalStorage = window.localStorage

  function setUserAgent(userAgent) {
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: userAgent
    })
  }

  function resetUserAgent() {
    window.navigator = __origNav
  }

  function renderComponent(props) {
    return mount(
      <ReactSmartAppBanner {...props} />
    )
  }

  function serverRenderComponent(props) {
    return renderToString(
      <ReactSmartAppBanner {...props} />
    )
  }

  it('renders', () => {
    component = renderComponent()
    expect(component).not.toBeFalsy()
  })

  describe('when using a Nexus 5 on Chrome', () => {
    beforeEach(() => {
      setUserAgent('Mozilla/5.0 (Linux; Android 4.4.4; Nexus 5 Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.114 Mobile Safari/537.36')

      component = renderComponent()
    })

    afterEach(() => {
      resetUserAgent()
    })

    it('renders', () => { expect(component).not.toBeFalsy() })
    it('is android', () => { expect(component.state().os).toBe('android')})
    it('is not hidden', () => { expect(component.state().hide).toBe(false) })
  })

  describe('when using a Nokia Lumia 520 on IEMobile', () => {
    beforeEach(() => {
      setUserAgent('Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520)')

      component = renderComponent()
    })

    afterEach(() => {
      resetUserAgent()
    })

    it('renders', () => { expect(component).not.toBeFalsy() })
    it('is windows', () => { expect(component.state().os).toBe('windows') })
    it('is not hidden', () => { expect(component.state().hide).toBe(false) })
  })

  describe('when using an iPhone 4 on Safari for iOS 4.2.1', () => {
    beforeEach(() => {
      setUserAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5')

      component = renderComponent()
    })

    afterEach(() => {
      resetUserAgent()
    })

    it('renders', () => { expect(component).not.toBeFalsy() })
    it('is ios', () => { expect(component.state().os).toBe('ios') })
    it('is not hidden', () => { expect(component.state().hide).toBe(false) })
  })

  describe('when using an iPhone 5 on Chrome for iOS 7.0', () => {
    beforeEach(() => {
      setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3')

      component = renderComponent()
    })

    afterEach(() => {
      resetUserAgent()
    })

    it('renders', () => { expect(component).not.toBeFalsy() })
    it('is ios', () => { expect(component.state().os).toBe('ios') })
    it('is not hidden', () => { expect(component.state().hide).toBe(false) })
  })

  describe('when using an iPhone 5 on Safari for iOS 7.0', () => {
    beforeEach(() => {
      setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53')

      component = renderComponent()
    })

    afterEach(() => {
      resetUserAgent()
    })

    it('renders', () => { expect(component).not.toBeFalsy() })
    it('is ios', () => { expect(component.state().os).toBe('ios') })
    it('is hidden', () => { expect(component.state().hide).toBe(true) })

    describe('but overwritting OS with android', () => {
      beforeEach(() => {
        component = renderComponent({ os: 'android' })
      })

      it('renders', () => { expect(component).not.toBeFalsy() })
      it('is android', () => { expect(component.state().os).toBe('android') })
      it('is not hidden', () => { expect(component.state().hide).toBe(false) })
    })
  })

  describe('when close clicked', () => {
    var node

    beforeEach(() => {
      setUserAgent('Mozilla/5.0 (Linux; Android 4.4.4; Nexus 5 Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.114 Mobile Safari/537.36')
    })

    afterEach(() => {
      resetUserAgent()
    })

    it('uses close function on CloseButton click', () => {
      component = renderComponent()

      const closeButton = component.find(CloseButton)
      expect(component.instance().close).toEqual(closeButton.prop('onClick'))
    })

    it('sets the hide state', () => {
      component = renderComponent()
      component.instance().close()
      expect(component.state().hide).toBe(true)
    })

    it('calls onClose callback', () => {
      const onClose = jest.fn()
      component = renderComponent({ onClose })
      component.instance().close()
      expect(onClose).toBeCalled()
    })

    describe('6 days ago', () => {
      beforeEach(() => {
        window['date'] = Date.now() - 86400000 * 6
        window['localStorage'] = {
          setItem: () => {},
          getItem: () => { return window['date'] },
          removeItem: () => { window['date'] = undefined },
        }
        component = renderComponent()
      })

      afterEach(() => {
        window['localStorage'] = __origLocalStorage
      })

      it('sets the hide state', () => { expect(component.state().hide).toBe(true) })
    })

    describe('8 days ago', () => {
      beforeEach(() => {
        window['date'] = Date.now() - 86400000 * 8
        window['localStorage'] = {
          setItem: () => {},
          getItem: () => { return window['date'] },
          removeItem: () => { window['date'] = undefined },
        }
        component = renderComponent()
      })

      afterEach(() => {
        window['localStorage'] = __origLocalStorage
      })

      it('sets the hide state', () => {
        expect(component.state().hide).toBe(false)
      })
    })
  })

  describe('when attributes are overwitten', () => {
    it('renders', () => {
      component = renderComponent({
        icon: {
          style: {
            android: { backgroundImage: 'url(data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)' },
            windows: { backgroundImage: 'url(data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)' },
            ios: { backgroundImage: 'url(data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)' },
          },
        },
        header: {
          title: 'Facebook',
          subtitle: {
            android: 'Free - In Google Play',
            windows: 'Free - In Windows Store',
            ios: 'Free - On the App Store',
          },
        },
        viewButton: {
          attributes: {
            android: { href: 'https://play.google.com/store/apps/details?id=com.facebook.katana' },
            ios: { href: 'https://itunes.apple.com/US/app/id284882215' },
            windows: { href: 'http://www.windowsphone.com/s?appid=82a23635-5bd9-df11-a844-00237de2db9e' }
          },
          text: 'Open',
          onClick: () => {}
        },
      })
      expect(component).not.toBeFalsy()
    })
  })

  describe('when allowedOs is only ["android", "ios"]', () => {
    describe('and a Nokia Lumia 520 on IEMobile is used', () => {
      beforeEach(() => {
        setUserAgent('Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520)')

        component = renderComponent({allowedOs: ['android', 'ios']})
      })

      afterEach(() => {
        resetUserAgent()
      })

      it('renders', () => { expect(component).not.toBeFalsy() })
      it('is windows', () => { expect(component.state().os).toBe('windows') })
      it('is hidden', () => { expect(component.state().hide).toBe(true) })
    })
  })

  describe('#componentDidMount', () => {
    let onUpdateSpy

    beforeEach(() => {
      onUpdateSpy = jasmine.createSpy('onUpdate')
      component = renderComponent()
      component.setProps({ onUpdate: onUpdateSpy })
    })

    it('calls onUpdate callback', () => {
      expect(onUpdateSpy).toHaveBeenCalledWith(component.state())
    })
  })
})
