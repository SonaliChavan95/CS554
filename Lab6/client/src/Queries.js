import { gql } from "@apollo/client";

const GET_UNSPLASHED_IMAGES =  gql`
  query Images($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const GET_BINNED_IMAGES =  gql`
  query BinnedImages {
    binnedImages {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const USER_POST_IMG = gql`
  query UserPost {
    userPostedImages {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const ADD_POST = gql`
  mutation AddPost($url: String!, $description: String, $posterName: String) {
    uploadImage(url: $url, description: $description,
      posterName: $posterName) {
      id
      url
      description
      posterName
      userPosted
      numBinned
      binned
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $url: String, $posterName: String,
    $description: String, $userPosted: Boolean, $binned: Boolean) {
    updateImage(id: $id, url: $url,
      posterName: $posterName, description: $description,
      userPosted: $userPosted, binned: $binned) {
      id
      url
      description
      posterName
      userPosted
      numBinned
      binned
    }
  }
`;

const REMOVE_POST = gql`
  mutation RemovePost($id: ID!) {
    deleteImage(id: $id) {
      id
      url
      description
      posterName
      userPosted
      numBinned
      binned
    }
  }
`;

export default {
  GET_UNSPLASHED_IMAGES,
  GET_BINNED_IMAGES,
  USER_POST_IMG,
  ADD_POST,
  UPDATE_POST,
  REMOVE_POST
};