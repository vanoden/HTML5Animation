
<?php
    if (empty($_REQUEST['method'])) {
?>
<html>
<head>
    <title>Tony's Animation Test</title>
    <script src="animation.js" type="application/javascript"></script>
    <script type="application/javascript">
        var frame;

        window.addEventListener('load', (event) => {
            console.log('page is fully loaded');

            var frame_elem = document.getElementById('animationFrame');
            frame = Object.create(Frame);
            frame.init(document.getElementById('animationFrame'));

            var sprite1 = Object.create(Sprite);
            sprite1.begin(5,5,1.5,15);
            sprite1.color = 'blue';
            frame.addSprite(sprite1);

            var sprite2 = Object.create(Sprite);
            sprite2.begin(10,10,-2.1,13);
            sprite2.color = 'red';
            frame.addSprite(sprite2);

            var sprite3 = Object.create(Sprite);
            sprite3.begin(100,10,1.8,17);
            sprite3.color = 'green';
            frame.addSprite(sprite3);

            frame.go();
        });

    </script>
    <style>
        #animationFrame {
            border: 1px solid red;
        }
    </style>
</head>
<body>
<canvas id="animationFrame" width="1600px" height="960px"></canvas>
</body>
</html>
<?php
    }
?>