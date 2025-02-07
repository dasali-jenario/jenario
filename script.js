// Update chart configurations for Free Fall
window.freefallChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timePoints.map(t => t.toFixed(2)),
        datasets: [{
            label: 'Height (m)',
            data: positionPoints,
            borderColor: '#4C51BF',
            tension: 0.4,
            fill: false
        }, {
            label: 'Velocity (m/s)',
            data: velocityPoints,
            borderColor: '#48BB78',
            tension: 0.4,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (s)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Height (m) / Velocity (m/s)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        }
    }
});

// Update SUVAT chart configuration
window.suvatChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timePoints,
        datasets: [{
            label: 'Position (m)',
            data: positionPoints,
            borderColor: '#4C51BF',
            tension: 0.4,
            fill: false
        }, {
            label: 'Velocity (m/s)',
            data: velocityPoints,
            borderColor: '#48BB78',
            tension: 0.4,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (s)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Position (m) / Velocity (m/s)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        }
    }
});

// Update Projectile Motion chart configuration
window.projectileChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Trajectory',
            data: timePoints.map((_, i) => ({
                x: xPoints[i],
                y: yPoints[i]
            })),
            borderColor: '#4C51BF',
            backgroundColor: '#4C51BF',
            showLine: true,
            tension: 0.4,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Distance (m)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Height (m)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        }
    }
});
