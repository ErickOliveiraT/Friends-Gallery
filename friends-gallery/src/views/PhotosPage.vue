<template>
  <div>
    <div class="flex w-full mt-10 items-center justify-center bg-grey-lighter">
      <form enctype="multipart/form-data" novalidate>
        <label
          class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-green-600"
        >
          <svg
            class="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
            />
          </svg>
          <span class="mt-2 text-base leading-normal">Upload a Photo</span>
          <input @change="onFileChange" accept="image/*" type="file" class="hidden" />
        </label>
      </form>
    </div>
    <div class="flex flex-wrap p-10 justify-center m-auto w-full" v-if="photos">
      <div class="shadow-xl ml-4 mt-4 w-4/12" v-for="(photo, idx) in photos" :key="idx">
        <amplify-s3-image
          level="public"
          :img-key="photo.thumbnail ? photo.thumbnail.key : photo.fullsize.key"
          class="w-4/12"
        ></amplify-s3-image>
        <br>
        <div id='approve' v-if="user.username=='admin'">
          <span class="mt-2 text-base leading-normal">Status: {{photo.status}}<br></span>
        </div>
        <div id='like'>
          <span class="mt-2 text-base leading-normal">Likes: {{photo.likes_count}}</span>
          <button type="submit" class="btn" v-if="!photo.liked_by_user" v-on:click="processLike(photo.id,'like')"> 🤍 <br></button>
          <button type="submit" class="btn" v-if="photo.liked_by_user" v-on:click="processLike(photo.id,'unlike')"> ❤️ <br></button>
        </div>
        <span class="mt-2 text-base leading-normal" v-if="photo.comments.length>0">Comments:</span><br>
        <span class="mt-2 text-base leading-normal" v-for="(comment,text) in photo.comments" :key="text">{{comment.user}}: {{comment.text}}<br></span><br>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  
  export default {
    mounted() {
      this.getPhotos();
    },
    data: () => ({
      photos: []
    }),

    methods: {
      ...mapActions({
        createPhotoVue: "albumInfo/createPhoto",
        getPhotosVue: "albumInfo/getPhotos",
        processLikeVue: "albumInfo/processLike"
      }),

      async onFileChange(file) {
        if (!file.target || !file.target.files[0]) {
          return;
        }
        try {
          let photo = await this.createPhotoVue({file: file.target.files[0], username: this.user.username});
          this.photos.push(photo);
        } catch (error) {
          console.log("error create photo", error);
        }
      },

      async getPhotos() {
        let photos = await this.getPhotosVue(this.user.username);
        this.photos = photos;
      },

      updatePhoto(photo_id, data) {
        for (let i = 0; i < this.photos.length; i++) {
          if (this.photos[i].id == photo_id) {
            this.photos[i] = data;
            break;
          }
        }
      },

      async processLike(photo_id, action) {
        this.updateLikeButton(photo_id, action); //Just for fast response
        let photo = await this.processLikeVue({photo_id, username: this.user.username, action});
        this.updatePhoto(photo_id, photo);
      },

      updateLikeButton(photo_id, action) {
        for (let i = 0; i < this.photos.length; i++) {
          if (this.photos[i].id == photo_id) {
            this.photos[i].liked_by_user = action == 'like' ? true : false;
            this.photos[i].likes_count = action == 'like' ? this.photos[i].likes_count++ : this.photos[i].likes_count--;
            break;
          }
        }
      },

      

      
    },

    computed: {
      ...mapGetters({
        user: "auth/user",
      })
    }
  };
</script>

<style  scoped>
amplify-s3-image {
  --width: 75%;
}
</style>