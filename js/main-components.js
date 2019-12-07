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
                            "Authorization": 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                ).then(
                    (response) => {

                        for (index in response.body) {
                            context.beginPath();
                            context.strokeStyle = response.body[index].hit ? "green" : "red";
                            context.fillStyle = response.body[index].hit ? "green" : "red";

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