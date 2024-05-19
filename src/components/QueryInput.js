import React, { useState } from 'react';
import { navigate } from "gatsby"

import magnifierImage from '../images/magnifier.png';
import * as styles from '../styles/QueryInput.module.css';

/** Input component that gets search query and navigate to search page with query as params.
   Empty query is ignored 
*/
export default function QueryInput() {
  const [query, setQuery] = useState('');

  function onSubmit(event) {
    event.preventDefault();

    if (query === '') {
      return
    }
    
    const params = new URLSearchParams()
    params.append('query', query)
    const url = `/search?${params.toString()}`
    navigate(url)
  }

  return (
    <div className={styles["queryInput"]}>
      <img className={styles["queryInput__form__magnifierImage"]} src={magnifierImage} />
      <form className={styles["queryInput__form"]} id="search" onSubmit={ onSubmit }>
        <input className={styles["queryInput__form__input"]} placeholder="search posts here!" onChange={ e => setQuery(e.target.value) } />
      </form>
    </div>
  )
}