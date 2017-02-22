import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PureRender from 'pure-render-decorator'
import MobileDetect from 'mobile-detect'

import CloseButton from './close-button'
import ViewButton from './view-button'
import Header from './header'
import Icon from './icon'
import { BaseStyle } from './stylesheets'

@PureRender
class ReactSmartAppBanner extends Component {

  static propTypes = {
    closeButton: React.PropTypes.shape({
      attributes: React.PropTypes.object,
      text: React.PropTypes.string,
      style: React.PropTypes.object,
    }),
    icon: React.PropTypes.shape({
      style: React.PropTypes.object,
    }),
    header: React.PropTypes.shape({
      title: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object,
      ]),
      subtitle: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object,
      ]),
      style: React.PropTypes.object,
    }),
    viewButton: React.PropTypes.shape({
      attributes: React.PropTypes.object,
      text: React.PropTypes.string,
      style: React.PropTypes.object,
    }),
    os: React.PropTypes.oneOf(['android', 'windows', 'ios']),
    allowedOs: React.PropTypes.arrayOf(React.PropTypes.string),
    onUpdate: React.PropTypes.func,
    onClose: React.PropTypes.func
  };

  static defaultProps = {
    allowedOs: ['android', 'windows', 'ios'],
    onUpdate: () => {},
    onClose: () => {}
  };

  static storageKey = 'react-smart-app-banner_closed_at';

  constructor(props) {
    super(props)
  }

  state = {
    os: this.props.os || 'android',
    hide: this.props.os ? false : true,
  };

  componentDidMount() {
    this.detectOs()
    this.rememberHideState()
  }

  componentDidUpdate() {
    this.props.onUpdate(this.state)
  }

  detectOs() {
    if (window && window.navigator && !this.props.os) {
      let md = new MobileDetect(window.navigator.userAgent)
      this.md = md

      if (md.is('iOS') && md.is('Safari') && md.version('iOS') > 6) {
        this.setState({os: 'ios'}, this.checkAllowedOs)
      } else if (md.is('iOS')) {
        this.setState({os: 'ios', hide: false}, this.checkAllowedOs)
      } else if (md.is('AndroidOS')) {
        this.setState({os: 'android', hide: false}, this.checkAllowedOs)
      } else if (md.is('WindowsPhoneOS')) {
        this.setState({os: 'windows', hide: false}, this.checkAllowedOs)
      }
    }
  }

  rememberHideState() {
    if(window && window.localStorage){
      var lastCloseDate = window.localStorage.getItem(ReactSmartAppBanner.storageKey)
      if(lastCloseDate && (Date.now() - lastCloseDate) < 86400000 * 7) {
        this.setState({ hide: true })
      } else {
        window.localStorage.removeItem(ReactSmartAppBanner.storageKey)
      }
    }
  }

  checkAllowedOs() {
    if (this.props.allowedOs.indexOf(this.state.os) < 0) {
      this.setState({ hide: true })
    }
  }

  close = () => {
    this.setState({ hide: true })

    if(
      window &&
      window.localStorage &&
      !window.localStorage.getItem(ReactSmartAppBanner.storageKey)
    ){
      window.localStorage.setItem(ReactSmartAppBanner.storageKey, Date.now())
    }

    this.props.onClose()
  }

  mergeProps(component) {
    return Object.assign({},
      this.props[component],
      { os: this.state.os }
    )
  }

  render() {
    if (this.state.hide) return false

    return (
      <section style={Object.assign({},
          BaseStyle.smartAppBanner.all,
          BaseStyle.smartAppBanner[this.state.os],
        )}
      >
        <CloseButton {...this.mergeProps('closeButton')} onClick={this.close} />
        <Icon {...this.mergeProps('icon')} />
        <Header {...this.mergeProps('header')} />
        <ViewButton {...this.mergeProps('viewButton')} />
      </section>
    )
  }

}

export default ReactSmartAppBanner
