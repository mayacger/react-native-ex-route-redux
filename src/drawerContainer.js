import React, { Component, PropTypes } from 'react';
import { Animated, Dimensions,View, Text, touchablewithoutfeedback } from 'react-native';

let { width, height } = Dimensions.get('window');


class Drawer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    menuComponent: PropTypes.func,
    navState: PropTypes.object,
    position: PropTypes.string,
    scenes: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.element,
    ]),
    show: PropTypes.bool,
    width: PropTypes.number,
  };

  static defaultProps = {
    position: 'left',
    width,
  };

  constructor(props) {
    super(props);

    let animatedValue = this.props.width * -1;
    this.isRight = props.position === 'right';

    this.state = {
      animatedValue: new Animated.Value(animatedValue),
    };
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.show !== this.props.show;
  }
  componentDidUpdate() {
    let _animatedValue = this.props.show ? 0 : this.props.width * -1;

    Animated.timing(
      this.state.animatedValue,
      {
        toValue: _animatedValue,
        duration: 400,
      },
    ).start();
  }
  render() {
    let top = 0;
    let side = 'left';
    let alignSide = 'flex-start';
    if (this.isRight) {
      side = 'right';
      alignSide = 'flex-end';
    }
    const MenuComponent = this.props.menuComponent;
    let { dispatch, navigate} = this.props;

    let closeMenu = () => (
      <View  style={{flex:1,width:width - 300,height}}
        onStartShouldSetResponderCapture={(e, gestureState) => {
          if (side == 'left') {
              dispatch(navigate.toggleLeftDrawer())
          }else{
              dispatch(navigate.toggleRightDrawer())
          }
        }}>

      </View>
    )
    return (
      <Animated.View
        key="View"
        style={[{ position: 'absolute', top, [side]: this.state.animatedValue, overflow: 'hidden', height, width: this.props.width, flexDirection: 'row',backgroundColor: 'rgba(0,0,0,0)'}]}>
        { side == 'right' && closeMenu() }
        <View  style={{width:300}}>
          <MenuComponent  scenes={this.props.scenes} navigate={navigate} />
        </View>
        { side == 'left' && closeMenu() }
      </Animated.View>
    );
  }
}

export default Drawer;
