import React, { PropTypes } from 'react';
import { NavigationExperimental } from 'react-native';

const {
  Header: NavigationHeader
} = NavigationExperimental;

const propTypes = {
  scene: PropTypes.object,
};

export default function navBar (navigate, dispatch, props, backAction) {
  // Fix ghosting issue when popping back.
  if (props.scene.index !== props.scenes.length - 1) {
    return (
      <NavigationHeader
        { ...props }
        renderTitleComponent={() => true}
        renderLeftComponent={() => true}
        renderRightComponent={() => true}
      />
    );
  }

  /* eslint react/prop-types: 0 */
  let scene = props.scene.route.props;

  if (scene.hideNavBar) {
    return null;
  }

  let title = scene.title || '';

  let renderTitle;
  if (scene.renderTitle) {
    renderTitle = () => scene.renderTitle(scene, navigate, dispatch);
  } else {
    renderTitle = () => <NavigationHeader.Title textStyle={scene.titleStyle}>{title}</NavigationHeader.Title>;
  }
  let renderLeftButton = (navProps) => {
    if (navProps.scene.index !== 0) {
      return scene.renderBackButton && scene.renderBackButton(scene, navigate, dispatch);
    }

    return scene.renderLeftButton && scene.renderLeftButton(scene, navigate, dispatch);
  };

  let renderRightButton = () => scene.renderRightButton(scene, navigate, dispatch);
  return (
    <NavigationHeader
      { ...props }
      style={[scene.defaultheaderStyle,scene.headerStyle]}
      onNavigateBack={backAction}
      renderTitleComponent={renderTitle}
      renderLeftComponent={(scene.renderLeftButton || scene.renderBackButton) && renderLeftButton}
      renderRightComponent={scene.renderRightButton && renderRightButton}
    />
  );
};

navBar.propTypes = propTypes;

// export default navBar;
