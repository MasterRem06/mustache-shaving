import { CommonModule } from '@angular/common';
import {Component, HostListener, OnInit} from '@angular/core';

interface Hair {
    id: number;
    isShaved?: boolean;
    radius?: number;
    color?: number;
    angle?: number;
    size?: number;
    mirror: number;
}

@Component({
    selector: 'app-something-interesting',
    template: `
        <div class="container">
            <h1>Shave the mustache!</h1>
            <h2>Press ENTER to remove some hairs. Press ESC to reset.</h2>
            
            <div class="mustache">
                @for (hair of hairs; track hair.id) {
                    <div
                        class="hair"
                        [ngStyle]="{
                            'border-radius': hair.radius + '%',
                            'transform': 'rotate(' + hair.angle + 'deg) scale(' + hair.mirror + ', 1)',
                            'border': hair.size + 'px solid transparent',
                            'border-left-color': 'hsl(' + hair.color + ', 65%, 25%)',
                        }"
                        [ngClass]="hair.isShaved ? 'hair-falling-animation' : ''"
                    ></div>
                }
            </div>

            <h3 *ngIf="!hairIds?.length">Congratulations!!!</h3>
        </div>
    `,
    styles: [`
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }

        .mustache {
            display: flex;
            flex-wrap: wrap;

            .hair {
                position: relative;
                width: 1px;
                height: 100px;
            }

            
            .hair-falling-animation {
                -webkit-animation: falling 4s 0s;
                -webkit-animation-fill-mode: forwards;

                &:nth-of-type(2n) { -webkit-animation: falling2 5s 0s; -webkit-animation-fill-mode: forwards; }
                &:nth-of-type(3n) { -webkit-animation: falling3 4s 0s; -webkit-animation-fill-mode: forwards; }
            }
        }

        @-webkit-keyframes falling {
            0% {
                -webkit-transform:
                    translate3d(0,0,0)
                    rotate(0deg);
            }
            100% {
                -webkit-transform:
                    translate3d(0,200px,0)
                    rotate(90deg);
                opacity: 0.6;
            }
        }

        @-webkit-keyframes falling2 {
            0% {
                -webkit-transform:
                    translate3d(0,0,0)
                    rotate(0deg);
            }
            100% {
                -webkit-transform:
                    translate3d(-100px,200px,0)
                    rotate(260deg);
                opacity: 0.6;
            }
        }

        @-webkit-keyframes falling3 {
            0% {
                -webkit-transform:
                    translate3d(0,0,0)
                    rotate(0deg);
            }
            100% {
                -webkit-transform:
                    translate3d(100px,200px,0)
                    rotate(-85deg);
                opacity: 0.6;
            }
        }
    `],
    imports: [CommonModule],
    standalone: true
})
export class SomethingInterestingComponent implements OnInit {
    private readonly NUMBER_OF_HAIRS = 50;

    public hairs?: Hair[];
    public hairIds?: number[]; 

    @HostListener('document:keydown.enter', ['$event'])
    onEnterHandler(_: KeyboardEvent) {
        this.shaveOneHair();
    }
    
    @HostListener('document:keydown.escape', ['$event'])
    onEscHandler(_: KeyboardEvent) {
        this.generateRandomHairs();
    }

    public ngOnInit(): void {
        this.generateRandomHairs();
    }

    private generateRandomHairs(): void {
        this.hairs = Array(this.NUMBER_OF_HAIRS).fill({}).map((_, index) => {
            return {
                id: index,
                isShaved: false,
                radius: Math.random() * 50 + 30,
                color: Math.random() * 35 + 10,
                angle: Math.random() * 20 - 10,
                size: Math.random() * 8 + 3,
                mirror: Math.random() > 0.5 ? 1 : -1
            }
        });
        this.hairIds = this.hairs.map(hair => hair.id);
    }

    private shaveOneHair(): void {
        const randomIndex = Math.floor(Math.random() * (this.hairIds?.length ?? 0));
        const hairId = this.hairIds?.[randomIndex];

        if (hairId != undefined && this.hairs?.[hairId]) {
            this.hairs[hairId].isShaved = true;
            this.hairIds = this.hairIds?.filter(hairId => hairId !== (this.hairIds?.[randomIndex] || 0))
        }
    }
}