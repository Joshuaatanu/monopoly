'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, FileText, RefreshCw } from 'lucide-react';

interface GameStatsProps {
    totalDebt: number;
    totalInterest: number;
    activeLoansCount: number;
    totalPassedGo: number;
}

export function GameStats({
    totalDebt,
    totalInterest,
    activeLoansCount,
    totalPassedGo,
}: GameStatsProps) {
    const stats = [
        {
            label: 'Total Outstanding',
            value: `$${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            label: 'Total Interest',
            value: `+$${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: TrendingUp,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
        },
        {
            label: 'Active Loans',
            value: activeLoansCount.toString(),
            icon: FileText,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            label: 'Times Passed GO',
            value: totalPassedGo.toString(),
            icon: RefreshCw,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
