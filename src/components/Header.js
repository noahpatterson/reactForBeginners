import React from 'react';


const Header = (props) => {
  return(
    <header className="top">
      <h1>
        Catch
        <span className="ofThe">
          <span className="of">Of</span>
          <span className="the">the</span>
        </span>
        Day
      </h1>
      <h3 className="tagLine"><span>{ props.tagLine }</span></h3>
    </header>
  );

}
    
Header.propTypes =  {
  tagLine: React.PropTypes.string.isRequired
}

export default Header;