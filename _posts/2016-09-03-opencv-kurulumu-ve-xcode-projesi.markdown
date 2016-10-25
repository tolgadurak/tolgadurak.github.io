---
layout: post
title:  "OpenCV Kurulumu ve Xcode Projesi (OS X El Capitan) "
date:   2016-09-03 06:03:14 +0300
categories: jekyll update
excerpt_separator: <!--more-->
author: Tolga Durak
imgurl: opencv-logo.png

---
___

### Giriş

OpenCV açık kaynak görüntü işleme ve makine öğrenme yazılım kütüphanesidir. İçerisinde 2500’den fazla optimize edilmiş algoritma ve birçok modül bulundurur. Bu algoritmalar yüz tespiti ve tanıma, nesne tanıma ve takibi, göz hareketlerini takip etme gibi
amaçlar için tasarlanmıştır. Cross platform yani Windows, OS X, Linux, Android ve iOS
işletim sistemlerinde çalışabilmektedir.   <!--more-->

OpenCV statik ya da paylaşımlı kütüphaneler şekilde derlenip kullanılabilir.

 - `Paylaşımlı` kütüphanelerle oluşturulan uygulamalarda kütüphane fonksiyonları çalışma zamanında referans yoluyla çağrılır. Uygulamanın boyutu az olacaktır. Fakat OpenCV'nin sistemde kurulu olması gerekmektedir.

 - `Statik` kütüphanelerle oluşturulan uygulamalarda kütüphane fonksiyonlarının kaynak kodu uygulamayla birlikte derlenir. Böylece uygulamanın bir parçası olur. Başka bir bilgisayarda OpenCV kurulumu olmadan çalıştırılabilir. Fakat uygulamanın boyutu çok fazla olacaktır.



___

### Kurulum

OS X işletim sisteminde OpenCV kurulumu için Homebrew paket yöneticisini kullanabilirsiniz. Homebrew kurulumu için [http://brew.sh/](http://brew.sh/)

#### OpenCV'nin Homebrew ile Kurulumu (Paylaşımlı Kütüphaneler):
    brew tap homebrew/science
    brew install opencv3 --build-from-source


#### OpenCV'nin Homebrew ile Kurulumu (Statik Kütüphaneler):
    brew tap homebrew/science
    brew install opencv3 --build-from-source --with-static

**Yukarıdaki yöntemlerden birini uygulayınız.**  Homebrew [OpenCV ](https://github.com/opencv/opencv) projesini GitHub'tan indirerek derleme işlemine başlayacaktır. Ayrıca derleme işlemi için gerekli olan araçların kurulumunu yapacaktır. Bu derleme işlemi makinenizin hızına bağlı olarak birkaç dakika sürebilir. İşlem sonucunda `header` ve `library` dosyaları aşağıdaki dizinlerde oluşturulacaktır.

    /usr/local/opt/opencv3/include
    /usr/local/opt/opencv3/lib

___

### OpenCV Xcode Projesi Oluşturma


 OpenCV kurulumunu tamamladıktan sonra Xcode IDE'sini açıp yeni bir proje oluşturabilirsiniz.

  - Projenin şablonunu `Command Line Tool` ve dilini `C++` olarak seçiniz.

  - OpenCV'nin paylaşımlı kütüphanelerine referans yapmak için `Project Navigator` bölümünden projeyi seçip `Build Settings` kısmına giriniz.

  - Buradaki arama bölümüne `Search Paths` yazınız.

  - `Header Search Paths` bölümüne `/usr/local/opt/opencv3/include` yazınız.

  - `Library Search Paths` bölümüne `/usr/local/opt/opencv3/lib` yazınız.

  - Bu sefer arama bölümüne `Other Linker Flags` yazınız.

  - `Other Linker Flags` bölümüne aşağıdakileri yazınız.

        -lopencv_calib3d -lopencv_core -lopencv_features2d -lopencv_flann -lopencv_highgui -lopencv_imgcodecs -lopencv_imgproc -lopencv_ml -lopencv_objdetect -lopencv_photo -lopencv_shape -lopencv_stitching -lopencv_superres -lopencv_video -lopencv_videoio -lopencv_videostab

___

#### Örnek Proje (main.cpp)

    #include <stdio.h>
    #include <opencv2/opencv.hpp>

    using namespace cv;

    int main(int argc, char** argv )
    {
    if ( argc != 2 )
    {
        printf("usage: DisplayImage.out <Image_Path>\n");
        return -1;
    }

    Mat image;
    image = imread( argv[1], 1 );

    if ( !image.data )
    {
        printf("No image data \n");
        return -1;
    }
    namedWindow("Display Image", WINDOW_AUTOSIZE );
    imshow("Display Image", image);

    waitKey(0);

    return 0;
    }

Yukarıdaki kodu çalıştırmak için Xcode üzerinden komut satırı argümanı belirtmeniz gerekmektedir. Bunu gerçekleştirmek için `Command - Less Than` klavye kısayolunu kullanınız. Açılan pencerede `Run` bölümüne girip komut satırı argümanları oluşturabilirsiniz. Komut satırı argümanı olarak istediğiniz resmi yolunu belirtiniz.
Program çalıştığında ekranda istediğiniz resim görüntülenecektir.

Herhangi bir sorunla karşılaşırsanız benimle iletişime geçebilirsiniz.
