$(function(){

    let bgImages = ["bg_image1", "bg_image2","bg_image3", "bg_image4", "bg_image5", "bg_image6","bg_image7", "bg_image8"]
    let img = new Image()
    let imgPath = 'images/'
    let imgExtension = ".jpg"
    let imgURL = ""

    function preload(){

        for (let i of bgImages){
            img.url = imgPath+bgImages[i]
        }

        changeImage()
        setInterval(changeImage,8000)

    }
    function changeImage(){
        let randNum = Math.floor(Math.random() * 8)
        if ($(window).width < 1024) {
            imgURL = imgPath+bgImages[randNum]+"-m"+imgExtension
        } else {
            imgURL = imgPath+bgImages[randNum]+"-m"+imgExtension
        }

        $('#home').css("background-image", "url(\'"+imgURL+"\')")   
    }

    preload()

})