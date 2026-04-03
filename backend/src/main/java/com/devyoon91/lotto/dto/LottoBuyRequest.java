package com.devyoon91.lotto.dto;

import java.util.List;

public class LottoBuyRequest {
    private int purchaseAmount;
    private List<String> manualNumbers;

    public LottoBuyRequest() {}

    public int getPurchaseAmount() { return purchaseAmount; }
    public void setPurchaseAmount(int purchaseAmount) { this.purchaseAmount = purchaseAmount; }
    public List<String> getManualNumbers() { return manualNumbers; }
    public void setManualNumbers(List<String> manualNumbers) { this.manualNumbers = manualNumbers; }
}
