// var xhttp = new XMLHttpRequest()
// xhttp.onreadystatechange = function() {
//   if (this.readyState == 4 && this.status == 200) {
//     document.getElementById('footer').innerHTML = xhttp.responseText
//   }
// }
// xhttp.open('GET', 'https://cardconjurer.com/footer.txt')
// xhttp.send()
document.getElementById('footer').innerHTML = `
<div class='footer'>
    <div>
        <div>Theme</div>
        <hr>
        <div>
            <select id='inputColorPalette' onchange='loadScript("/data/scripts/palettes/" + this.value + ".js")'>
                <option disabled>Grayscale</option>
                <option value='lightMode'>Light Mode</option>
                <option value='darkMode'>Dark Mode</option>
                <option disabled>Colored</option>
                <option value='lowpolyRed'>Red</option>
                <option value='lowpolyGreen' selected='selected'>Green</option>
                <option value='lowpolyBlue'>Blue</option>
                <option disabled>Color-Changing</option>
                <option value='dayRave'>Day Rave</option>
                <option value='nightRave'>Night Rave</option>
            </select>
        </div>
    </div>
    <div>
        <div>Navigation</div>
        <hr>
        <div>
            <a href='/'>主页</a><br>
            <a href='/creator'>制卡</a><br>
        </div>
    </div>
    <div>

        <div>Legal</div>
        <hr>
        <div>
            <a href='/legal'>条款和条件</a><br>
        </div>
    </div>
    <script defer src="/data/scripts/animations.js"></script>
</div>
`
