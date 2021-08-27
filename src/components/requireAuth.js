import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

// If a component requires authentication to view import this
// when exporting the component do export deafult requireAuth(<component name>)

export default ChildComponent => {
  const ComposedComponent = props => {
    const history = useHistory()
    useEffect(() => {
      if (props.auth.isLoaded && props.auth.isEmpty) return history.push("/login");
    }, [props.auth, history]);

    return <ChildComponent {...props} />;
  };

  function mapStateToProps(state) {
    return {
      auth: state.firebase.auth
    };
  }

  return connect(mapStateToProps)(ComposedComponent);
};