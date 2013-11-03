$(window).load(function() {

    $('portfolio-list').filterable();

    $("a[rel='colorbox']").colorbox({
        scalePhotos:true,  
        maxWidth: "90%",
         maxHeight: "90%" 
     });


});