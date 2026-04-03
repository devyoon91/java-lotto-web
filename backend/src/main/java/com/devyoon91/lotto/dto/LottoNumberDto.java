package com.devyoon91.lotto.dto;

import java.util.List;

public class LottoNumberDto {
    private List<Integer> numbers;
    private boolean autoGeneration;

    public LottoNumberDto(List<Integer> numbers, boolean autoGeneration) {
        this.numbers = numbers;
        this.autoGeneration = autoGeneration;
    }

    public List<Integer> getNumbers() { return numbers; }
    public boolean isAutoGeneration() { return autoGeneration; }
}
