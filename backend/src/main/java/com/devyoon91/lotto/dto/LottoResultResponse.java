package com.devyoon91.lotto.dto;

import java.util.List;

public class LottoResultResponse {
    private List<WinningStatItem> statistics;
    private double profitRate;
    private boolean profit;
    private long totalPrize;

    public LottoResultResponse(List<WinningStatItem> statistics, double profitRate, boolean profit, long totalPrize) {
        this.statistics = statistics;
        this.profitRate = profitRate;
        this.profit = profit;
        this.totalPrize = totalPrize;
    }

    public List<WinningStatItem> getStatistics() { return statistics; }
    public double getProfitRate() { return profitRate; }
    public boolean isProfit() { return profit; }
    public long getTotalPrize() { return totalPrize; }
}
