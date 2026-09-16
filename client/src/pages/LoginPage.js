// =============================================
// client/src/pages/LoginPage.js
// Login page with AngularJS form validation
// =============================================

import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const angularInitialized = useRef(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) navigate(`/${user.role}`);
  }, [user]);

  // Initialize AngularJS for form validation after React renders
  useEffect(() => {
    if (angularInitialized.current) return;
    angularInitialized.current = true;

    // AngularJS module for login form validation
    window.angular.module('loginApp', ['ngMessages'])
      .controller('LoginCtrl', ['$scope', function ($scope) {
        $scope.formData = { email: '', password: '' };
        $scope.serverError = '';
        $scope.loading = false;

        // Submit using jQuery AJAX
        $scope.submitLogin = function () {
          if ($scope.loginForm.$invalid) return;
          $scope.loading = true;
          $scope.serverError = '';

          // jQuery AJAX call to backend
          $.ajax({
            url: '/api/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify($scope.formData),
            xhrFields: { withCredentials: true },
            success: function (data) {
              $scope.$apply(function () {
                $scope.loading = false;
              });
              // Pass user to React context via custom event
              window.dispatchEvent(new CustomEvent('loginSuccess', { detail: data.user }));
            },
            error: function (xhr) {
              $scope.$apply(function () {
                $scope.loading = false;
                $scope.serverError = xhr.responseJSON?.message || 'Login failed';
              });
            }
          });
        };
      }]);

    // Bootstrap AngularJS on our form container
    const el = document.getElementById('ng-login-form');
    if (el && !el.getAttribute('ng-app')) {
      window.angular.bootstrap(el, ['loginApp']);
    }
  }, []);

  // Listen for successful login event from AngularJS
  useEffect(() => {
    const handler = (e) => {
      login(e.detail);
      navigate(`/${e.detail.role}`);
    };
    window.addEventListener('loginSuccess', handler);
    return () => window.removeEventListener('loginSuccess', handler);
  }, [login, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎵 SpotifyClone</div>
        <p className="auth-subtitle">Log in to continue listening</p>

        {/* AngularJS-controlled form container */}
        <div id="ng-login-form" ng-controller="LoginCtrl">
          <form name="loginForm" noValidate ng-submit="submitLogin()">

            {/* Server error */}
            <div ng-show="serverError" className="alert-spotify alert-error-spotify" ng-bind="serverError"></div>

            {/* Email field */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="name@example.com"
                ng-model="formData.email"
                required
              />
              <div ng-messages="loginForm.email.$error" ng-if="loginForm.email.$touched">
                <div className="error-msg" ng-message="required">Email is required.</div>
                <div className="error-msg" ng-message="email">Please enter a valid email.</div>
              </div>
            </div>

            {/* Password field */}
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Your password"
                ng-model="formData.password"
                required
                ng-minlength="6"
              />
              <div ng-messages="loginForm.password.$error" ng-if="loginForm.password.$touched">
                <div className="error-msg" ng-message="required">Password is required.</div>
                <div className="error-msg" ng-message="minlength">Password must be at least 6 characters.</div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-spotify" ng-disabled="loginForm.$invalid || loading">
              <span ng-show="!loading">LOG IN</span>
              <span ng-show="loading">Logging in...</span>
            </button>
          </form>

          <div className="text-center mt-4" style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: 'white', fontWeight: 600 }}>Sign up</a>
          </div>
          <div className="text-center mt-2">
            <a href="/guest" style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>Continue as Guest</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
