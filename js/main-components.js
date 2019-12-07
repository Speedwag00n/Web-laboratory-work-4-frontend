Vue.component(
    'task-chart',
    {
        template: 
            `
            <div class="workspace-item-container">
                <h1>Область</h1>
                <div class="horizontal-centering-container">
                    <div class="chart-box">
                        <img class="task-chart-image" :src="image">
                        <canvas ref="canvas" class="task-chart"></canvas>
                    </div>
                    <span class="default-warning">Выберите радиус</span>
                </div>
            </div>
            `,
        data: function() {
            return {
                image: './img/chart-image.png',

                arrowLength: 7,
                lineWidth: 2,
                pointScale: 3,
                signSpace: 9,
                pointRadius: 1.5,
                axisesColor: "black",
                signsColor: "black",
                signsFont: "14px monospace",
                rCoefficient: 0.4
            }
        },
        methods: {
            draw: function() {
                this.drawAxises();
                this.drawAxisesSigns();
                this.drawPointsSigns(3);
                this.drawPoints(3);                
            },

            drawAxises: function() {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext("2d");
            
                context.beginPath();
                context.strokeStyle = this.axisesColor;
                context.lineWidth = this.lineWidth;
            
                context.moveTo(canvas.width / 2, canvas.height);
                context.lineTo(canvas.width / 2, 0);
            
                context.lineTo(canvas.width / 2 - this.arrowLength / 2, this.arrowLength);
                context.moveTo(canvas.width / 2, 0);
                context.lineTo(canvas.width / 2 + this.arrowLength / 2, this.arrowLength);
            
                context.moveTo(0, canvas.height / 2);
                context.lineTo(canvas.width, canvas.height / 2);
            
                context.lineTo(canvas.width - this.arrowLength, canvas.height / 2 + this.arrowLength / 2);
                context.moveTo(canvas.width, canvas.height / 2);
                context.lineTo(canvas.width - this.arrowLength, canvas.height / 2 - this.arrowLength / 2);
            
            
                context.moveTo(canvas.width * 0.1, canvas.height / 2 - this.pointScale);
                context.lineTo(canvas.width * 0.1, canvas.height / 2 + this.pointScale);
            
                context.moveTo(canvas.width * 0.3, canvas.height / 2 - this.pointScale);
                context.lineTo(canvas.width * 0.3, canvas.height / 2 + this.pointScale);
            
                context.moveTo(canvas.width * 0.7, canvas.height / 2 - this.pointScale);
                context.lineTo(canvas.width * 0.7, canvas.height / 2 + this.pointScale);
            
                context.moveTo(canvas.width * 0.9, canvas.height / 2 - this.pointScale);
                context.lineTo(canvas.width * 0.9, canvas.height / 2 + this.pointScale);
            
                context.moveTo(canvas.width / 2 - this.pointScale, canvas.height * 0.1);
                context.lineTo(canvas.width / 2 + this.pointScale, canvas.height * 0.1);
            
                context.moveTo(canvas.width / 2 - this.pointScale, canvas.height * 0.3);
                context.lineTo(canvas.width / 2 + this.pointScale, canvas.height * 0.3);
            
                context.moveTo(canvas.width / 2 - this.pointScale, canvas.height * 0.7);
                context.lineTo(canvas.width / 2 + this.pointScale, canvas.height * 0.7);
            
                context.moveTo(canvas.width / 2 - this.pointScale, canvas.height * 0.9);
                context.lineTo(canvas.width / 2 + this.pointScale, canvas.height * 0.9);
            
                context.stroke();
            },

            drawAxisesSigns: function() {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext("2d");
                context.font = this.signsFont;
                context.fillStyle = this.signsColor;
            
                context.fillText("Y", canvas.width / 2 + this.signSpace / 2, this.signSpace);
                context.fillText("X", canvas.width - this.signSpace, canvas.height / 2 - this.signSpace / 2);
            },

            drawPointsSigns: function(r) {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext("2d");
                context.font = this.signsFont;
                context.fillStyle = this.signsColor;
            
                let rIsNumber = !isNaN(Number(r));
            
                let sign;
                rIsNumber ? sign = -r + "" : sign = "-" + r;
                if (rIsNumber && (Math.abs(sign) - Math.floor(Math.abs(sign))) == 0) {
                    sign = Number(sign).toFixed(1);
                }
                context.fillText(sign, canvas.width * 0.1 - 0.5 * sign.length * this.signSpace, canvas.height / 2 - this.signSpace / 2);
                context.fillText(sign, canvas.width / 2 + this.signSpace / 2, canvas.height * 0.9 + this.signSpace / 2);
                rIsNumber ? sign = -r / 2 + "" : sign = "-" + r + "/2";
                if (rIsNumber && (Math.abs(sign) - Math.floor(Math.abs(sign))) == 0) {
                    sign = Number(sign).toFixed(1);
                }
                context.fillText(sign, canvas.width * 0.3 - 0.5 * sign.length * this.signSpace, canvas.height / 2 - this.signSpace / 2);
                context.fillText(sign, canvas.width / 2 + this.signSpace / 2, canvas.height * 0.7 + this.signSpace / 2);
                rIsNumber ? sign = r / 2 + "" : sign = r + "/2";
                if (rIsNumber && (Math.abs(sign) - Math.floor(Math.abs(sign))) == 0) {
                    sign = Number(sign).toFixed(1);
                }
                context.fillText(sign, canvas.width * 0.7 - 0.5 * sign.length * this.signSpace, canvas.height / 2 - this.signSpace / 2);
                context.fillText(sign, canvas.width / 2 + this.signSpace / 2, canvas.height * 0.3 + this.signSpace / 2);
                sign = r + "";
                if (rIsNumber && (Math.abs(sign) - Math.floor(Math.abs(sign))) == 0) {
                    sign = Number(sign).toFixed(1);
                }
                context.fillText(sign, canvas.width * 0.9 - 0.5 * sign.length * this.signSpace, canvas.height / 2 - this.signSpace / 2);
                context.fillText(sign, canvas.width / 2 + this.signSpace / 2, canvas.height * 0.1 + this.signSpace / 2);
            },

            drawPoints: function(r) {
                let canvas = this.$refs.canvas;
                let context = canvas.getContext("2d");

                this.$http.get(
                    'http://localhost:8080/api/point?r=' + r,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                ).then(
                    (response) => {
                        for (index in response.body) {
                            context.beginPath();
                            context.strokeStyle = response.body[index].hit ? 'green' : 'red';
                            context.fillStyle = response.body[index].hit ? 'green' : 'red';

                            context.arc(this.toOriginalX(response.body[index].x, r), this.toOriginalY(response.body[index].y, r), r, 0, 2 * Math.PI);
                            context.closePath();
                            context.fill();
                            context.stroke();
                        }
                    },
                    (error) => { }
                );
            },

            toOriginalX: function(computingX, R) {
                let chartWidth = this.$refs.canvas.width;
                let X = computingX / R;
                X *= this.rCoefficient * chartWidth;
                X += chartWidth / 2;
            
                return X;
            },
            
            toOriginalY: function(computingY, R) {
                let chartHeight = this.$refs.canvas.height;
                let Y = computingY / R;
                Y *= this.rCoefficient * chartHeight;
                Y = -Y + chartHeight / 2;
            
                return Y;
            },
            
            toComputingX: function(originalX, R) {
                let chartWidth = this.$refs.canvas.width;
                let X = originalX - chartWidth / 2;
                X /= this.rCoefficient * chartWidth;
                X *= R;
            
                return X;
            },
            
            toComputingY: function(originalY, R) {
                let chartHeight = this.$refs.canvas.height;
                let Y = -originalY + chartHeight / 2;
                Y /= this.rCoefficient * chartHeight;
                Y *= R;
            
                return Y;
            }
        },
        mounted: function() {
            this.$refs.canvas.width = this.$refs.canvas.offsetWidth;
            this.$refs.canvas.height = this.$refs.canvas.offsetHeight;
            
            this.draw();
        }
    }
);

Vue.component(
    'point-form',
    {
        template: 
            `
            <div class="workspace-item-container">
                <h1>Параметры</h1>
                <form class="parameter-form">
                    <label class="parameter-header">X:</label>
                    <div class="parameter-container">
                        <label class="parameter-label">-5</label>
                        <input type="radio" value="-5" v-model="x">

                        <label class="parameter-label">-4</label>
                        <input type="radio" value="-4" v-model="x">

                        <label class="parameter-label">-3</label>
                        <input type="radio" value="-3" v-model="x">

                        <label class="parameter-label">-2</label>
                        <input type="radio" value="-2" v-model="x">

                        <label class="parameter-label">-1</label>
                        <input type="radio" value="-1" v-model="x">

                        <label class="parameter-label">0</label>
                        <input type="radio" value="0" v-model="x">

                        <label class="parameter-label">1</label>
                        <input type="radio" value="1" v-model="x">

                        <label class="parameter-label">2</label>
                        <input type="radio" value="2" v-model="x">

                        <label class="parameter-label">3</label>
                        <input type="radio" value="3" v-model="x">
                    </div>
                    <span v-show="warningX" class="default-warning">{{ warningX }}</span>

                    <label class="parameter-header">Y:</label>
                    <div class="parameter-container">
                        <input type="text" placeholder="(-5 ... 5)" maxlength="10" v-model="y">
                    </div>
                    <span v-show="warningY" class="default-warning">{{ warningY }}</span>

                    <label class="parameter-header">R:</label>
                    <div class="parameter-container">
                        <label class="parameter-label">1</label>
                        <input type="radio" value="1" v-model="r">

                        <label class="parameter-label">2</label>
                        <input type="radio" value="2" v-model="r">

                        <label class="parameter-label">3</label>
                        <input type="radio" value="3" v-model="r">
                    </div>
                    <span v-show="warningR" class="default-warning">{{ warningR }}</span>

                    <div class="horisontal-centering-container button-container">
                        <button type="submit" class="submit-button" v-on:click="sendPoint">Отправить</button>
                        <span v-show="status === 'Unknown'" class="default-warning">Произошла неизвестная ошибка, попробуйте отправить запрос позже</span>
                    </div>
                </form>
            </div>
            `,

        data: function() {
            return {
                x: '',
                y: '',
                r: '',

                warningX: '',
                warningY: '',
                warningR: '',

                status: ''
            }
        },
        methods: {
            sendPoint: function(e) {
                e.preventDefault()
                this.status = ''
                if (this.validateForm()) {
                    return
                }
                this.$http.post(
                    'http://localhost:8080/api/point', 
                    {
                        'x': this.x,
                        'y': this.y,
                        'r': this.r
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                ).then(
                    (response) => {
                        //draw new point
                    },
                    (error) => {
                        this.status = 'Unknown'
                    }
                )
            },
            validateForm: function() {
                this.warningX = this.generateWarningX();
                this.warningY = this.generateWarningY();
                this.warningR = this.generateWarningR();
                return this.warningX || this.warningY || this.warningR;
            },
            generateWarningX: function() {
                if (!this.x) {
                    return 'X должен быть указан'
                }
                return ''
            },
            generateWarningY: function() {
                if (!this.y) {
                    return 'Y должен быть указан'
                }
                if (!(!isNaN( Number(this.y) ) && this.y.lastIndexOf('.') != (this.y.length - 1))) {
                    return 'Y должен быть числом'
                }
                if (!(this.y > -5 && this.y < 5)) {
                    return 'Y должен быть в диапазоне (-5 ... 5)'
                }
                return ''
            },
            generateWarningR: function() {
                if (!this.r) {
                    return 'R должен быть указан'
                }
                return ''
            }
        }
    }
);

Vue.component(
    'result-table',
    {
        template: 
            `
                <div class="horizontal-centering-container">
                    <h1>История результатов</h1>
                    <table class="result-table">
                        <tr>
                            <th>X</th>
                            <th>Y</th>
                            <th>R</th>
                            <th>Попадание</th>
                            <th>Попадание (для текущего R)</th>
                        </tr>
                        <tr v-for="point in points">
                            <td>{{ point.x }}</td>
                            <td>{{ point.y }}</td>
                            <td>{{ point.r }}</td>
                            <td>{{ point.hit }}</td>
                            <td>{{ point.hitNow }}</td>
                        </tr>
                    </table>
                </div>
            `,
        data: function() {
            return {
                points: []
            }
        },
        created: function() {
            this.$http.get(
                'http://localhost:8080/api/point?r=3',
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            ).then(
                (response) => { this.points = response.body },
                (error) => { }
            );
        }
    }
);