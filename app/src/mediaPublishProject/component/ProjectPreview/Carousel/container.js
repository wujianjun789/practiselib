import React from 'react';
// import Transition from 'react-transition-group';

// const defaultStyle = {
//   transition: 'width 500ms',
//   transform: 'translateX(0px)',
//   opacity: 0,
// };

// const transitionStyles = {
//   entering: { opacity: 1, width: '0px' },
//   entered:  { opacity: 1 },
// };

// const CarouselContainer = (props) => {
//   const { virtualArray, arrayList } = this.props;
//   return <ol> {virtualArray.map((item) => {
//     const index = arrayList.indexOf(item);
//     const state = virtualArray.indexOf(item);
//     return (
//       <Transition timeout={500} key={index}>
//         <li style={{ width: '400px', height: '100%', ...defaultStyle, ...transitionStyles[state] }} onClick={this.props.onClick}> //onClick={(e) => { return this.magicClick(index, 0); }}>
//         <img src={item} />
//         </li>
//       </Transition>
//     );
//   })}
//   </ol>;
// };
const CarouselContainer = (props) => {
  const { style = {} } = props;
  return <div className="img-container">
    <img src={props.src} style={style}/>
  </div>;

};

export default CarouselContainer;