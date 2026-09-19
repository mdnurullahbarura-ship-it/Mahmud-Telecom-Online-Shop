/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Products from '../Products';

const Search: React.FC = () => {
  // Reusing Products page which already handles 'q' query param
  return <Products />;
};

export default Search;
