import React from 'react';
import classnames from 'classnames';

export default ({data, onClick}) => {
  const handleClick = (key) => () => {
    return onClick(key);
  }
  return (<ul>
    {data.map(i => {
      return (<li
        key={i.key}
        className={classnames({selected: i.selected})}
        onClick={handleClick(i.key)}
      >
        {i.name}
      </li>);
    })}
    </ul>);
};
