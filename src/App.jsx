import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public & user-facing pages
import HomeLoggedOut from './components/HomeLoggedOut.jsx';
import HomeLoggedIn from './components/HomeLoggedIn.jsx';
import Login from './components/Userlogin.jsx';
import UserSignUp from './components/UserSignUp.jsx';
import UserForgotPassword from './components/UserForgotPassword.jsx';
import MovieDetailsLoggedIn from './components/MovieDetailsLoggedIn.jsx';
import MovieDetailsLoggedOut from './components/MovieDetailsLoggedOut.jsx';
import TheatreSeatSelection from './components/TheatreSeatSelection.jsx';
import TicketPayment from './components/TicketPayment.jsx';
import PaymentSuccess from './components/PaymentSuccess.jsx';
import UserProfile from './components/UserProfile.jsx';
import TheatreInfo from './components/TheatreInfo.jsx';

// Admin pages
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Rankings from './components/Rankings.jsx';
import SendMessage from './components/SendMessage.jsx';
import AddNewMovie from './components/AddNewMovie.jsx';
import AdminAnalytics from './components/AdminAnalytics.jsx';
import AdminGraphs from './components/AdminGraphs.jsx';

// // Theatre owner pages
import TheatreOwnerLogin from './components/TheatreOwnerLogin.jsx';
import TheatreOwnerSignup from './components/TheatreOwnerSignup.jsx';
import TheatreOwnerDashboard from './components/TheatreOwnerDashboard.jsx';
import OwnerForgotPassword from './components/OwnerForgotPassword.jsx';
import TheatreOwnerGraphs from './components/TheatreOwnerGraphs.jsx';
import TheatreDetailsSetup from './components/TheatreDetailsSetup.jsx';
import MovieListingSetup from './components/MovieListingSetup.jsx';
import MovieManagement from './components/MovieManagement.jsx';
import OwnerTheatreDetails from './components/OwnerTheatreDetails.jsx';

import OwnerMovieList from './components/OwnerMovieList.jsx';
import OwnerMovieDetails from './components/OwnerMovieDetails.jsx';
import OwnerShowsManage from './components/OwnerShowsManage.jsx';
import OwnerAddMovies from './components/OwnerAddMovies.jsx';
import TheatreAnalytics from './components/TheatreAnalytics.jsx';

const App = () => {
  return (
    <Routes>
      {/* Public & user routes */}
      <Route path="/" element={<HomeLoggedOut />} />
      <Route path="/home" element={<HomeLoggedIn />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<UserSignUp />} />
      <Route path="/forgot-password" element={<UserForgotPassword />} />

      {/* Movie details & booking flow */}
      <Route path="/movies/:movieId" element={<MovieDetailsLoggedIn />} />
      <Route path="/movies/:movieId/public" element={<MovieDetailsLoggedOut />} />
      <Route path="/book/:movieId" element={<TheatreSeatSelection />} />
      <Route path="/booking/:showId/payment" element={<TicketPayment />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/theatre/:theatreId/info" element={<TheatreInfo />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />}>
         <Route index element={<Rankings />} />
         <Route path="add-movie" element={<AddNewMovie />} />
      </Route>
      <Route path="/admin/message" element={<SendMessage />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/analytics/graphs" element={<AdminGraphs />} />

      {/* Theatre owner routes */}
      <Route path="/owner/login" element={<TheatreOwnerLogin />} />
      <Route path="/owner/signup" element={<TheatreOwnerSignup />} />
      <Route path="/owner/forgot-password" element={<OwnerForgotPassword />} />
      <Route path="/owner/dashboard" element={<TheatreOwnerDashboard />} />
      <Route path="/owner/analytics" element={<TheatreAnalytics />} />
      <Route path="/owner/theatre/setup" element={<TheatreDetailsSetup />} />
      <Route path="/owner/theatre/create" element={<TheatreDetailsSetup />} />
      <Route path="/owner/movies" element={<OwnerMovieList />} />
      <Route path="/owner/movies/details/:movieId" element={<OwnerMovieDetails />} />
      <Route path="/owner/movies/add" element={<OwnerAddMovies />} />
      <Route path="/owner/shows/manage" element={<OwnerShowsManage />} />
      <Route path="/owner/movies/setup" element={<MovieListingSetup />} />
      <Route path="/owner/movies/manage" element={<MovieManagement />} />
      <Route path="/owner/theatre/details" element={<OwnerTheatreDetails />} />
    </Routes>
  );
};

export default App;
