package com.devyoon91.lotto.dto;

public class WinningStatItem {
    private String rank;
    private int matchCount;
    private boolean bonusMatch;
    private long prize;
    private int winCount;

    public WinningStatItem(String rank, int matchCount, boolean bonusMatch, long prize, int winCount) {
        this.rank = rank;
        this.matchCount = matchCount;
        this.bonusMatch = bonusMatch;
        this.prize = prize;
        this.winCount = winCount;
    }

    public String getRank() { return rank; }
    public int getMatchCount() { return matchCount; }
    public boolean isBonusMatch() { return bonusMatch; }
    public long getPrize() { return prize; }
    public int getWinCount() { return winCount; }
}
