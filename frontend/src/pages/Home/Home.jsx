import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import Services from '../../components/Services/Services';

const Home = ({ setShowLogin }) => {
  const [category, setCategory] = useState('All');

  return (
    <div>
      <Header setShowLogin={setShowLogin} />
      <div className="main">
        <Services />
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay category={category} />
      </div>
    </div>
  );
};

export default Home;
