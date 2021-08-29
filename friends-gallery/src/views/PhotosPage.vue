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
          level="protected"
          :img-key="photo.thumbnail ? photo.thumbnail.key : photo.fullsize.key"
          class="w-4/12"
        ></amplify-s3-image>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from "vuex";
  
  export default {
    mounted() {
      this.getPhotos();
    },
    data: () => ({
      photos: [],
      user: null
    }),

    methods: {
      ...mapActions({
        createPhotoVue: "albumInfo/createPhoto",
      }),

      async onFileChange(file) {
        if (!file.target || !file.target.files[0]) {
          return;
        }
        try {
          //console.log('file: ', {file: file.target.files[0]});
          let photo = await this.createPhotoVue({file: file.target.files[0]});
          console.log('photo: ', photo)
          this.photos.push(photo);
          //await this.$store.dispatch("albumInfo/createPhoto", {file: file.target.files[0]});
          //this.getPhotos();
        } catch (error) {
          console.log("error create photo", error);
        }
      },

      async getPhotos() {
        
      }
    },
  };
</script>

<style  scoped>
amplify-s3-image {
  --width: 75%;
}
</style>