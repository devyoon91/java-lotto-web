package com.devyoon91.lotto.dto;

import java.util.List;

public class LottoResultRequest {
    private List<List<Integer>> lottos;
    private String winningNumbers;
    private int bonusNumber;
    private int purchaseAmount;

    public LottoResultRequest() {}

    public List<List<Integer>> getLottos() { return lottos; }
    public void setLottos(List<List<Integer>> lottos) { this.lottos = lottos; }
    public String getWinningNumbers() { return winningNumbers; }
    public void setWinningNumbers(String winningNumbers) { this.winningNumbers = winningNumbers; }
    public int getBonusNumber() { return bonusNumber; }
    public void setBonusNumber(int bonusNumber) { this.bonusNumber = bonusNumber; }
    public int getPurchaseAmount() { return purchaseAmount; }
    public void setPurchaseAmount(int purchaseAmount) { this.purchaseAmount = purchaseAmount; }
}
